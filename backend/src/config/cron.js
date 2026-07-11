import cron from "node-cron";
import { sync24hrHistories } from "../scripts/syncHistory.js";
import { syncTop250coins } from "../scripts/syncTop250.js";

// 🌟 THE LAZY LOCK: Keeps track of whether there is a sync job running right now
let isDbSyncing = false;

// Helper function to check and wait if the database is busy
const waitForLock = async () => {
  while (isDbSyncing) {
    console.log(
      "⏳ DB is currently busy syncing another job. Waiting 5 seconds...",
    );
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Pause for 3 seconds before checking again
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

  // Job: to fetch top 250coins
  cron.schedule("2/15 * * * *", async () => {
    await waitForLock();
    isDbSyncing = true;
    try {
      await syncTop250coins();
    } catch (error) {
      console.error("❌ Background cron failed:", error.message);
    } finally {
      isDbSyncing = false; // 🔓 Always release the lock when done
    }
  });
};
