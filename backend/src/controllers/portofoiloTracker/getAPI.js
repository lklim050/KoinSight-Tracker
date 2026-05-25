import {
  sync24hrHistories,
  sync30daysHistories,
} from "../../scripts/syncHistory.js";
import { syncTop250coins } from "../../scripts/syncTop250.js";

export const postWatch24hHistories = async (req, res) => {
  try {
    const { coins } = req.body;
    console.log(
      `🚀 Manual override trigger received for: ${coins || "Default Setup"}`,
    );

    // Pass the user/Bruno array directly into the worker loop
    await sync24hrHistories(coins);

    res.json({
      status: "ok",
      msg: "All target chart histories synchronized successfully!",
      syncedCoins: coins || `using default coins array`,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const postWatch30dHistories = async (req, res) => {
  try {
    const { coins } = req.body;
    console.log(
      `🚀 Manual override trigger received for: ${coins || "Default Setup"}`,
    );

    // Pass the user/Bruno array directly into the worker loop
    await sync30daysHistories(coins);

    res.json({
      status: "ok",
      msg: "All target chart histories synchronized successfully!",
      syncedCoins: coins || `using default coins array`,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const postTop250Coins = async (req, res) => {
  try {
    console.log(`🚀 Manual override trigger received for: ${"Default Setup"}`);

    const data = await syncTop250coins();

    //TBD
    // // 1. ADD THIS DEBUG LOG HERE 👇
    // console.log(
    //   "🔍 TYPE OF DATA:",
    //   typeof data,
    //   "IS ARRAY?:",
    //   Array.isArray(data),
    // );
    // console.log("📦 ACTUAL DATA STRUCTURE:", JSON.stringify(data)); // logs first 500 characters

    // const dataArray = Array.isArray(data) ? data : [data];
    // // const dataArray = Array.isArray(data) ? data : [data];

    res.json({
      status: "ok",
      msg: "All top 250 synchronized successfully!",
      show: `${data.length} entries saved`,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};
