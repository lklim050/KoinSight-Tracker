import cron from "node-cron";
import {
  sync24hrHistories,
  sync30daysHistories,
} from "../scripts/syncHistory.js";

// 🌟 THE LAZY LOCK: Keeps track of whether ANY sync job is running right now
let isDbSyncing = false;

// Helper function to check and wait if the database is busy
const waitForLock = async () => {
  while (isDbSyncing) {
    console.log(
      "⏳ DB is currently busy syncing another job. Waiting 3 seconds...",
    );
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Pause for 3 seconds before checking again
  }
};

export const initCronJobs = () => {
  console.log("⏰ Background cron engine initializing...");

  // Job: to fetch 24hr 5 min interval price on desired coin id for every 15 min
  cron.schedule("*/15 * * * *", async () => {
    await waitForLock();
    isDbSyncing = true;
    try {
      await sync24hrHistories();
    } catch (error) {
      console.error("❌ Background cron failed:", error.message);
    } finally {
      isDbSyncing = false; // 🔓 Always release the lock when done
    }
  });

  // Job: to fetch 30days 1hr interval price on desired coin id for ever
  cron.schedule("2 * * * *", async () => {
    await waitForLock();
    isDbSyncing = true;
    try {
      await sync30daysHistories();
    } catch (error) {
      console.error("❌ Background cron failed:", error.message);
    } finally {
      isDbSyncing = false; // 🔓 Always release the lock when done
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
