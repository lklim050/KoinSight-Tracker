import Assets from "../../models/Portofoilo/Assets.js";
import coinList from "../../data/coinList.json" with { type: "json" };
import UserModel from "../../models/User.js";
import { calculateUserAssets } from "../../utils/calculateUserAssets.js";
import { Crypto24hrHistory } from "../../scripts/syncHistory.js";

export const readAllAssets = async (req, res) => {
  try {
    const allAssets = await Assets.find();
    res.json(allAssets);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to update" });
  }
};

export const seedAssets = async (req, res) => {
  try {
    await Assets.deleteMany({});
    const data = coinList.map((coin) => ({
      _id: coin.id, // Sets "bitcoin" as the primary key for direct referencing!
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price || 0, // Fallbacks in case keys are empty
      market_cap_rank: coin.market_cap_rank || 999,
    }));

    const seed = await Assets.create(data);
    res.json({
      status: "ok",
      msg: `seed successfully, ${seed.length} entries created`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to seed" });
  }
};

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
    console.error(error.message);
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
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const testHistoricalHoldings = async (req, res) => {
  try {
    // 1. Fetch user & populate transactions
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v",
    );
    if (!user) return res.status(400).json({ msg: "User not found" });

    const userTransactions = user.transactions || [];

    // 2. Extract unique coin IDs from the transactions
    const uniqueCoinIds = Array.from(
      new Set(
        userTransactions
          .map((tx) =>
            tx.coinType && tx.coinType._id ? tx.coinType._id.toString() : null,
          )
          .filter(Boolean),
      ),
    );

    // ==========================================
    // MODULE A: Generate 5-Min Milestones (Past 24H)
    // ==========================================
    const milestones = [];
    const now = new Date();

    // Round current time down to the nearest 5 minutes
    const currentBucketTime = new Date(now);
    currentBucketTime.setMinutes(
      Math.floor(currentBucketTime.getMinutes() / 5) * 5,
      0,
      0,
    );

    // Generate 288 milestones (5 mins * 288 = 24 hours) working backward
    for (let i = 288; i >= 0; i--) {
      const milestoneDate = new Date(
        currentBucketTime.getTime() - i * 5 * 60 * 1000,
      );
      milestones.push(milestoneDate.toISOString());
    }

    // ==========================================
    // MODULE B: Normalize Your Split-Field DB Transactions (FIXED FIELD MAPPING)
    // ==========================================
    const cleanedTransactions = userTransactions
      .map((tx) => {
        let txMs = 0;
        if (tx.date) {
          // Extract "YYYY-MM-DD" from your midnight-bound DB date
          const baseDateStr = new Date(tx.date).toISOString().split("T")[0];
          // Clean your string time field (e.g., "21:40")
          const baseTimeStr =
            tx.time && tx.time.trim() ? tx.time.trim() : "00:00";

          // Force them together into an absolute UTC Unix timestamp integer
          txMs = new Date(`${baseDateStr}T${baseTimeStr}:00.000Z`).getTime();
        }

        return {
          coinId:
            tx.coinType && tx.coinType._id ? tx.coinType._id.toString() : null,
          type: tx.transType || tx.type, // 🚀 FIX: Handles 'transType' or 'type' safely
          amount: Number(tx.quantity) || Number(tx.amount) || 0, // 🚀 FIXED: Reads 'quantity' from your database!
          txMs,
          readableDate: tx.date,
          readableTime: tx.time,
        };
      })
      .filter((tx) => tx.coinId);

    // ==========================================
    // MODULE C: Process Running Balance Ledger
    // ==========================================
    const holdingsTimeline = milestones.map((timeStr) => {
      const currentMilestoneMs = new Date(timeStr).getTime();

      // Setup an empty balance sheet snapshot for this specific milestone
      const snapshotBalances = {};
      uniqueCoinIds.forEach((id) => {
        snapshotBalances[id] = 0;
      });

      // Accumulate only the transactions that occurred BEFORE or AT this milestone
      cleanedTransactions.forEach((tx) => {
        if (tx.txMs > currentMilestoneMs) return; // Ignore future actions

        if (tx.type === "buy") {
          snapshotBalances[tx.coinId] += tx.amount;
        } else if (tx.type === "sell") {
          snapshotBalances[tx.coinId] -= tx.amount;
        }
      });

      return {
        milestone: timeStr,
        localHumanTime: new Date(timeStr).toLocaleString(), // Helps us debug timezone offsets
        balances: snapshotBalances,
      };
    });

    // Send back the data logs so we can see if your tokens populate!
    res.json({
      totalMilestonesGenerated: holdingsTimeline.length,
      detectedCoins: uniqueCoinIds,
      rawTransactionsInspected: cleanedTransactions,
      data: holdingsTimeline, // Check if balances grow from 0 to your current holdings!
    });
  } catch (error) {
    console.error("Holdings tracking failure:", error.stack || error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

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
            `Failed to refresh CoinGecko data for ${targetCoinId}:`,
            apiError.message,
          );
          if (!coinHistory) continue;
        }
      }
    }
    // ==========================================
    // 4. Fetch up-to-date histories & merge timestamps (SHIFTED TO SGT)
    // ==========================================
    const updatedHistories = await Crypto24hrHistory.find({
      _id: { $in: uniqueCoinIds },
    });

    const priceTimelineMap = {};

    updatedHistories.forEach((coinRecord) => {
      const currentCoinId = coinRecord._id.toString();

      coinRecord.price_history.forEach((point) => {
        // 1. Parse the CoinGecko UTC timestamp
        const utcDateObj = new Date(point.timestamp);

        // 2. 🚀 THE TIMEZONE FIX: Force-shift the UTC time forward by 8 hours to align with Singapore Time (SGT)
        const sgtDateObj = new Date(utcDateObj.getTime() + 8 * 60 * 60 * 1000);

        // 3. Standardize time to 5-minute intervals in SGT
        const rawMinutes = sgtDateObj.getUTCMinutes(); // Use UTC methods now that the underlying value is shifted
        const bucketedMinutes = Math.floor(rawMinutes / 5) * 5;
        sgtDateObj.setUTCMinutes(bucketedMinutes, 0, 0);

        const timeStr = sgtDateObj.toISOString();

        if (!priceTimelineMap[timeStr]) {
          priceTimelineMap[timeStr] = {};
        }
        priceTimelineMap[timeStr][currentCoinId] = point.price;
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

          // 🚀 This matches your front-end input directly as literal local SGT numbers
          txMs = new Date(`${baseDateStr}T${baseTimeStr}:00.000Z`).getTime();
        }

        return {
          coinId:
            tx.coinType && tx.coinType._id ? tx.coinType._id.toString() : null,
          type: tx.transType || tx.type,
          amount: Number(tx.quantity) || Number(tx.amount) || 0,
          txMs,
        };
      })
      .filter((tx) => tx.coinId);

    // ==========================================
    // 6. Calculate running balances across chart points
    // ==========================================
    const balanceTimelineMap = {};

    sortedTimelineKeys.forEach((timeStr) => {
      balanceTimelineMap[timeStr] = {};
      const currentBucketMs = new Date(timeStr).getTime();

      // Initialize snapshot holdings to 0
      uniqueCoinIds.forEach((id) => {
        balanceTimelineMap[timeStr][id] = 0;
      });

      // Accumulate only historical balances up to this chart milestone
      cleanedTransactions.forEach((tx) => {
        if (tx.txMs > currentBucketMs) return; // Skip future transactions

        if (tx.type === "buy") {
          balanceTimelineMap[timeStr][tx.coinId] += tx.amount;
        } else if (tx.type === "sell") {
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
        timestamp: timeStr, // This timestamp payload string is now localized to SGT format
        value: Number(totalPortfolioValue.toFixed(4)),
      };
    });

    // Send back the cleanly mapped historical graph dataset
    res.json({
      status: "Fetch and sync executed successfully via SGT Timezone Alignment",
      count: finalPortfolioTimeline.length,
      data: finalPortfolioTimeline,
    });
  } catch (error) {
    console.error(
      "Portfolio history mapping error:",
      error.stack || error.message,
    );
    res.status(500).json({ msg: "Internal server error" });
  }
};
