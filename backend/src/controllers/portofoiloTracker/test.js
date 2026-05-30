import UserModel from "../../models/User.js";
import { Crypto24hrHistory } from "../../scripts/syncHistory.js";
import { calculateUserAssets } from "../../utils/calculateUserAssets.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getOrSyncPortfolioHistory = async (req, res) => {
  try {
    // 1. Fetch user from token and populate transactions via your layout
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v",
    );
    if (!user) return res.status(400).json({ msg: "user not found" });

    // 2. Use your utility to calculate current asset balances
    const assets = calculateUserAssets(user);

    // Extract the unique coin IDs needed for the database check/sync step
    const uniqueCoinIds = assets.map((asset) => asset._id).filter(Boolean);
    if (uniqueCoinIds.length === 0) {
      return res.status(200).json({ status: "No assets found", data: [] });
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // 3. Loop through coins to check if we need to fetch fresh data from CoinGecko
    for (const coinId of uniqueCoinIds) {
      let coinHistory = await Crypto24hrHistory.findById(coinId);

      // If the record doesn't exist, or it hasn't been fetched in the last 15 minutes, FETCH!
      if (
        !coinHistory ||
        !coinHistory.last_fetched ||
        new Date(coinHistory.last_fetched) < fifteenMinutesAgo
      ) {
        console.log(
          `[Cache Miss] Fetching fresh 24h history from CoinGecko for: ${coinId}`,
        );

        try {
          await delay(12000);
          // NATIVE FETCH IMPLEMENTATION:
          const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`;
          const apiResponse = await fetch(url);

          // Defensive Check: Native fetch treats 429/404/500 errors as completed actions,
          // so we must manually throw an error if response.ok is false.
          if (!apiResponse.ok) {
            throw new Error(
              `CoinGecko API returned status code ${apiResponse.status}`,
            );
          }

          // Decode JSON body cleanly
          const rawData = await apiResponse.json();

          // Map CoinGecko response [timestamp, price] into your schema's structural format
          const formattedHistory = rawData.prices.map(([timestamp, price]) => ({
            timestamp: new Date(timestamp),
            price: price,
          }));

          // Save or Update the document in your collection matching your controller pattern
          coinHistory = await Crypto24hrHistory.findByIdAndUpdate(
            coinId,
            {
              _id: coinId,
              last_fetched: new Date(),
              price_history: formattedHistory,
            },
            { upsert: true, new: true },
          );
        } catch (apiError) {
          console.error(
            `❌ Failed to refresh CoinGecko data for ${coinId}:`,
            apiError.message,
          );
          // Fallback: If CoinGecko rate-limits you or fails, continue with whatever is in DB
          if (!coinHistory) continue;
        }
      }
    }

    // 4. Fetch all up-to-date history data documents from your DB
    const updatedHistories = await Crypto24hrHistory.find({
      _id: { $in: uniqueCoinIds },
    });

    // 5. Group all price histories by common timestamps
    const timelineMap = {};
    updatedHistories.forEach((coinRecord) => {
      coinRecord.price_history.forEach((point) => {
        const dateObj = new Date(point.timestamp);

        // Extract the raw minutes (0 to 59)
        const rawMinutes = dateObj.getMinutes();

        // Round down to the nearest multiple of 5
        const bucketedMinutes = Math.floor(rawMinutes / 5) * 5;

        // Set the minutes to our bucket value, and clear seconds/ms
        dateObj.setMinutes(bucketedMinutes, 0, 0);

        const timeStr = dateObj.toISOString();

        if (!timelineMap[timeStr]) {
          timelineMap[timeStr] = {};
        }

        // Store the price under this exact 5-minute block
        timelineMap[timeStr][coinRecord._id] = point.price;
      });
    });

    // 6. Build final portfolio timeline coordinates using your assets array
    // Keep track of the most recent price for each coin as we move forward in time
    const lastKnownPrices = {};

    const finalPortfolioTimeline = Object.keys(timelineMap)
      .sort()
      .map((timeStr) => {
        const pricesAtTime = timelineMap[timeStr];
        let totalPortfolioValue = 0;

        assets.forEach((asset) => {
          const coinId = asset._id;

          // 1. If the current bucket has a price, use it and update our tracker
          if (pricesAtTime[coinId] !== undefined) {
            lastKnownPrices[coinId] = pricesAtTime[coinId];
          }

          // 2. Fallback: If this bucket missed the price, use the last known price.
          // Only use 0 if we have absolutely never fetched a price for it yet.
          const coinPrice = lastKnownPrices[coinId] || 0;
          const currentHoldings = asset.holdings || 0;

          totalPortfolioValue += currentHoldings * coinPrice;
        });

        return {
          timestamp: timeStr,
          value: Number(totalPortfolioValue.toFixed(4)),
        };
      });

    // 7. Send back the aggregated chart ready dataset
    res.json({
      status: "Fetch and sync executed successfully via Native Fetch",
      count: finalPortfolioTimeline.length,
      data: finalPortfolioTimeline,
    });
  } catch (error) {
    console.error("❌ Portfolio history mapping error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
