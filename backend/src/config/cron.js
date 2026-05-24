import cron from "node-cron";
import { syncWatchlist24hHistories } from "../scripts/syncHistory.js";

export const initCronJobs = () => {
  console.log("⏰ Background cron engine initializing...");

  // Job: to fetch 24hr 5 min interval price on desired coin id for every 15 min
  cron.schedule("*/5 * * * *", async () => {
    try {
      await syncWatchlist24hHistories();
    } catch (error) {
      console.error("❌ Background cron failed:", error.message);
    }
  });

  //   // Job: to implement later, tie to user portofoilo coin ids (Runs hourly)
  //   cron.schedule("0 * * * *", async () => {
  //     try {
  //       console.log("🔄 Running scheduled portfolio chart scan...");
  //       await syncAllActiveUserWatchlists();
  //     } catch (error) {
  //       console.error("❌ Background cron failed:", error.message);
  //     }
  //   });

  // You can easily add more cron tasks here in the future!
  // cron.schedule("0 0 * * *", () => { ... });
};
