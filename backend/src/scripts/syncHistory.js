import mongoose from "mongoose";

// this is main version, many documents based on watchlist with 289 entries (1 days 5 min interval) to DB

// 1. Update the schema to match your exact KVP design
const CryptoHistorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Set to "bitcoin" for direct reference lookups
    coinId: { type: String, required: true },
    last_fetched: { type: Date, default: Date.now },

    // Array of arrays to match CoinGecko's native [[timestamp, price], ...] style
    price_history: { type: [[Number]], required: true },
  },
  { collection: "crypto_histories" },
);

// 1a. Don't forget to add delay for multiple fetch requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CryptoHistory =
  mongoose.models.CryptoHistory ||
  mongoose.model("CryptoHistory", CryptoHistorySchema);

// 🌟 Pass targetCoins dynamically as an argument
export const syncWatchlist24hHistories = async (
  targetCoins = ["bitcoin", "ethereum", "tether", "binancecoin"],
) => {
  // If no array is passed, it defaults to bitcoin and ethereum

  for (const coin of targetCoins) {
    try {
      console.log(`⏳ Fetching history for ${coin}...`);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`,
      );

      if (!response.ok) {
        console.error(`⚠️ Skipped ${coin}: Status ${response.status}`);
        continue;
      }

      const data = await response.json();

      await CryptoHistory.findByIdAndUpdate(
        coin,
        {
          _id: coin,
          coinId: coin,
          last_fetched: new Date(),
          price_history: data.prices,
        },
        { upsert: true },
      );

      console.log(`✅ ${coin} saved!`);

      // Throttle delay to protect your free tier limits
      await delay(5000);
    } catch (error) {
      console.error(`❌ Error on ${coin}:`, error.message);
    }
  }
};

// // // To read into user portfoilo coin id and past into syncwatchlist24hhistories
// // // and later to be worked by cron
// // 🌟 THE NEW STRATEGIC WRAPPER: Gathers all active user portfolio IDs out of MongoDB
// export const syncAllActiveUserWatchlists = async () => {
//   try {
//     console.log(
//       "🔍 Database lookup: scanning user records for active coins...",
//     );

//     // 1. Fetch all user records, but only return their transaction arrays to save RAM
//     const users = await Auth.find({}, "transactions.coinType");

//     // 2. Extract out all coin IDs and flatten them into a single array
//     // Example output: ['bitcoin', 'ethereum', 'bitcoin', 'solana']
//     const rawCoinIds = users.flatMap((user) =>
//       user.transactions.map((tx) => tx.coinType),
//     );

//     // 3. Remove duplicate IDs so your loops don't call CoinGecko twice for the same coin!
//     // Example clean output: ['bitcoin', 'ethereum', 'solana']
//     const uniqueWatchlistCoins = [...new Set(rawCoinIds)];

//     if (uniqueWatchlistCoins.length === 0) {
//       console.log(
//         "📭 No active portfolio coins found across user accounts. Skipping run.",
//       );
//       return;
//     }

//     console.log(
//       `🎯 Active tracking list generated: [${uniqueWatchlistCoins.join(", ")}]`,
//     );

//     // 4. Pass the dynamically generated list straight into your worker loop
//     await syncWatchlist24hHistories(uniqueWatchlistCoins);
//   } catch (error) {
//     console.error("Watchlist aggregation failed:", error.message);
//   }
// };
