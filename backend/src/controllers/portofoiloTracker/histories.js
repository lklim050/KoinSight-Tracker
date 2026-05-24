import { syncWatchlist24hHistories } from "../../scripts/syncHistory.js";

export const postWatch24hHistories = async (req, res) => {
  try {
    const { coins } = req.body;
    console.log(
      `🚀 Manual override trigger received for: ${coins || "Default Setup"}`,
    );

    // Pass the user/Bruno array directly into the worker loop
    await syncWatchlist24hHistories(coins);

    res.json({
      status: "ok",
      msg: "All target chart histories synchronized successfully!",
      syncedCoins: coins || ["bitcoin", "ethereum", "tether", "binancecoin"],
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};
