import UserModel from "../../models/User.js";
import { calculateUserAssets } from "../../utils/calculateUserAssets.js";
import { Crypto24hrHistory } from "../../scripts/syncHistory.js";

export const getAssets = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v", // Hides the version tracking key automatically
    );
    if (!user) return res.status(400).json({ msg: "user not found" });

    const assets = calculateUserAssets(user);

    res.json({
      status: "ok",
      assets,
    });
  } catch (error) {
    console.error("❌", error.message);
    res.status(500).json({
      status: "ok",
      msg: "Internal server failed, please check console log",
    });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v", // Hides the version tracking key automatically
    );
    if (!user) return res.status(400).json({ msg: "user not found" });
    const assets = calculateUserAssets(user);

    let totalPortfolioCost = 0;
    let totalPortfolioValue = 0;
    let totalPriceChange24h = 0;
    let unrealisedEarning = 0;
    let realisedEarning = 0;

    assets.forEach((asset) => {
      totalPortfolioValue += asset.totalValue; // total value
      totalPortfolioCost += asset.holdings * asset.avgBuyPrice; // cost basis
      totalPriceChange24h +=
        asset.holdings * asset.currentPrice -
        (asset.holdings * asset.currentPrice) /
          (1 + asset.price_change_percentage_24h / 100);
      unrealisedEarning +=
        (asset.currentPrice - asset.avgBuyPrice) * asset.holdings;
      realisedEarning += asset.assetEarning;
    });

    const allocation = assets.map((asset) => {
      const assetCostBasis = asset.avgBuyPrice * asset.holdings;
      const percent =
        totalPortfolioCost > 0
          ? (assetCostBasis / totalPortfolioCost) * 100
          : 0;
      return {
        _id: asset._id,
        percent: Number(percent),
      };
    });

    const totalProfitLoss = totalPortfolioValue - totalPortfolioCost;
    const profitLossPercentage =
      totalPortfolioCost > 0 ? (totalProfitLoss / totalPortfolioCost) * 100 : 0;
    const totalPriceChange24hPercent =
      (totalPriceChange24h / (totalPriceChange24h + totalPortfolioValue)) * 100;
    const allTimeProfitLoss = unrealisedEarning + realisedEarning;
    const allTimeProfitLossPercent = allTimeProfitLoss / totalPortfolioCost;

    res.json({
      status: "ok",
      data: {
        totalPortfolioValue: totalPortfolioValue,
        totalPortfolioCost: totalPortfolioCost,
        totalPriceChange24h: totalPriceChange24h,
        totalPriceChange24hPercent: totalPriceChange24hPercent,
        totalProfitLoss: totalProfitLoss,
        profitLossPercentage: profitLossPercentage,
        allTimeProfitLoss: allTimeProfitLoss,
        allTimeProfitLossPercent: allTimeProfitLossPercent,
        allocation,
      },
    });
  } catch (error) {
    console.error("❌", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getOrSyncPortfolioHistory = async (req, res) => {
  try {
    // ==========================================
    // 1. Fetch user & populate transactions
    // ==========================================
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v",
    );
    if (!user) return res.status(400).json({ msg: "user not found" });

    const userTransactions = user.transactions || [];

    // ==========================================
    // 2. Extract unique coin IDs from transactions
    // ==========================================
    const uniqueCoinIds = Array.from(
      new Set(
        userTransactions
          .map((tx) =>
            tx.coinType && tx.coinType._id ? tx.coinType._id.toString() : null,
          )
          .filter(Boolean),
      ),
    );

    if (uniqueCoinIds.length === 0) {
      return res.status(200).json({ status: "No assets found", data: [] });
    }

    // ==========================================
    // 3. Sync Cache Check (CoinGecko Loops)
    // ==========================================
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    for (const targetCoinId of uniqueCoinIds) {
      let coinHistory = await Crypto24hrHistory.findById(targetCoinId);

      if (
        !coinHistory ||
        !coinHistory.last_fetched ||
        new Date(coinHistory.last_fetched) < fifteenMinutesAgo
      ) {
        console.log(
          `[Cache Miss] Fetching fresh 24h history from CoinGecko for: ${targetCoinId}`,
        );

        try {
          await delay(1300); // Prevent 429 rate limits

          const url = `https://api.coingecko.com/api/v3/coins/${targetCoinId}/market_chart?vs_currency=usd&days=1`;
          const apiResponse = await fetch(url);

          if (!apiResponse.ok) {
            throw new Error(
              `CoinGecko API returned status code ${apiResponse.status}`,
            );
          }

          const rawData = await apiResponse.json();

          const formattedHistory = rawData.prices.map(([timestamp, price]) => ({
            timestamp: new Date(timestamp),
            price: price,
          }));

          coinHistory = await Crypto24hrHistory.findByIdAndUpdate(
            targetCoinId,
            {
              _id: targetCoinId,
              last_fetched: new Date(),
              price_history: formattedHistory,
            },
            { upsert: true, returnDocument: "after" },
          );
        } catch (apiError) {
          console.error(
            `❌ Failed to refresh CoinGecko data for ${targetCoinId}:`,
            apiError.message,
          );
          if (!coinHistory) continue;
        }
      }
    }
    // ==========================================
    // 4. Fetch up-to-date histories & merge timestamps (SGT Clean String Format)
    // ==========================================
    const updatedHistories = await Crypto24hrHistory.find({
      _id: { $in: uniqueCoinIds },
    });

    const priceTimelineMap = {};

    updatedHistories.forEach((coinRecord) => {
      const currentCoinId = coinRecord._id.toString();

      coinRecord.price_history.forEach((point) => {
        const utcDateObj = new Date(point.timestamp);

        // 1. Shift forward 8 hours to align with Singapore Time
        const sgtDateObj = new Date(utcDateObj.getTime() + 8 * 60 * 60 * 1000);

        // 2. Standardize down to 5-minute intervals
        const rawMinutes = sgtDateObj.getUTCMinutes();
        const bucketedMinutes = Math.floor(rawMinutes / 5) * 5;
        sgtDateObj.setUTCMinutes(bucketedMinutes, 0, 0);

        // 3. 🚀 THE CRITICAL FIX: Strip off the trailing "Z" flag so parsers don't revert it
        // Transforms "2026-05-29T21:40:00.000Z" -> "2026-05-29T21:40:00.000"
        const cleanSgtTimeStr = sgtDateObj.toISOString().replace("Z", "");

        if (!priceTimelineMap[cleanSgtTimeStr]) {
          priceTimelineMap[cleanSgtTimeStr] = {};
        }
        priceTimelineMap[cleanSgtTimeStr][currentCoinId] = point.price;
      });
    });

    // Sort the master timeline coordinates chronologically
    const sortedTimelineKeys = Object.keys(priceTimelineMap).sort(
      (a, b) => new Date(a) - new Date(b),
    );

    // Forward-fill price gaps if one token array has extra points
    uniqueCoinIds.forEach((coinId) => {
      let runningPrice = 0;
      sortedTimelineKeys.forEach((timeStr) => {
        if (priceTimelineMap[timeStr][coinId] !== undefined) {
          runningPrice = priceTimelineMap[timeStr][coinId];
        } else {
          priceTimelineMap[timeStr][coinId] = runningPrice;
        }
      });
    });
    // ==========================================
    // 5. Pre-parse transactions with the correct fields
    // ==========================================
    const cleanedTransactions = userTransactions
      .map((tx) => {
        let txMs = 0;
        if (tx.date) {
          const baseDateStr = new Date(tx.date).toISOString().split("T")[0];
          const baseTimeStr =
            tx.time && tx.time.trim() ? tx.time.trim() : "00:00";

          txMs = new Date(`${baseDateStr}T${baseTimeStr}:00.000Z`).getTime();
        }

        // --- 🚀 FIX FOR COIN ID STRINGS vs POPULATED OBJECTS ---
        let finalCoinId = null;
        if (tx.coinType) {
          if (typeof tx.coinType === "object" && tx.coinType._id) {
            finalCoinId = tx.coinType._id.toString(); // For populated objects
          } else {
            finalCoinId = tx.coinType.toString(); // For flat strings like "bitcoin"
          }
        }

        return {
          coinId: finalCoinId,
          type: tx.transType || tx.type,
          amount: Number(tx.quantity) || Number(tx.amount) || 0,
          txMs,
        };
      })
      .filter((tx) => tx.coinId); // Now flat string matches won't get blocked!

    // ==========================================
    // 6. Calculate running balances across chart points
    // ==========================================
    const balanceTimelineMap = {};

    sortedTimelineKeys.forEach((timeStr) => {
      balanceTimelineMap[timeStr] = {};

      const currentBucketMs = new Date(`${timeStr}Z`).getTime();

      uniqueCoinIds.forEach((id) => {
        balanceTimelineMap[timeStr][id] = 0;
      });

      cleanedTransactions.forEach((tx) => {
        if (tx.txMs > currentBucketMs) return;

        // Clean and unify matching transaction actions
        const normalizedType = tx.type ? tx.type.toLowerCase().trim() : "";

        if (
          normalizedType === "buy" ||
          normalizedType === "transfer_in" ||
          normalizedType === "transfer in"
        ) {
          balanceTimelineMap[timeStr][tx.coinId] += tx.amount;
        } else if (
          normalizedType === "sell" ||
          normalizedType === "transfer_out" ||
          normalizedType === "transfer out"
        ) {
          balanceTimelineMap[timeStr][tx.coinId] -= tx.amount;
        }
      });
    });
    // ==========================================
    // 7. Compute Final Portfolio Values (Holdings * Prices)
    // ==========================================
    const finalPortfolioTimeline = sortedTimelineKeys.map((timeStr) => {
      const historicalPrices = priceTimelineMap[timeStr];
      const historicalHoldings = balanceTimelineMap[timeStr];
      let totalPortfolioValue = 0;

      uniqueCoinIds.forEach((coinId) => {
        const currentPrice = historicalPrices[coinId] || 0;
        const currentHoldings = historicalHoldings[coinId] || 0;

        totalPortfolioValue += currentHoldings * currentPrice;
      });

      return {
        timestamp: timeStr, // Sent as a clean local string (e.g., "2026-05-29T21:40:00.000")
        value: Number(totalPortfolioValue.toFixed(4)),
      };
    });

    res.json({
      status: "Fetch and sync executed successfully via Raw SGT Layout",
      count: finalPortfolioTimeline.length,
      data: finalPortfolioTimeline,
    });
  } catch (error) {
    console.error(
      "❌ Portfolio history mapping error:",
      error.stack || error.message,
    );
    res.status(500).json({ msg: "Internal server error" });
  }
};
