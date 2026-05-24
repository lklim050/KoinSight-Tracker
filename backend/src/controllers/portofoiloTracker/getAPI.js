import {
  sync24hrHistories,
  sync30daysHistories,
} from "../../scripts/syncHistory.js";

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
      syncedCoins: coins || ["bitcoin", "ethereum", "tether", "binancecoin"],
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
      syncedCoins: coins || ["bitcoin", "ethereum", "tether", "binancecoin"],
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};
