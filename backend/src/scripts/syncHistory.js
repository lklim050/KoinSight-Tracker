import mongoose from "mongoose";

// this is main version, many documents based on watchlist with 289 entries (1 days 5 min interval) to DB

// 1. Update the schema
const timeStampPriceSchema = new mongoose.Schema(
  {
    timestamp: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const Crypto24hrHistorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Set to "bitcoin" for direct reference lookups
    last_fetched: { type: Date, default: Date.now },

    // Array of arrays to match CoinGecko's native [[timestamp, price], ...] style
    price_history: [timeStampPriceSchema],
  },
  { collection: "crypto_24hr_5m" },
);

const Crypto30daysHistorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Set to "bitcoin" for direct reference lookups
    last_fetched: { type: Date, default: Date.now },

    // Array of arrays to match CoinGecko's native [[timestamp, price], ...] style
    price_history: [timeStampPriceSchema],
  },
  { collection: "crypto_30days_1hr" },
);

export const Crypto24hrHistory =
  mongoose.models.Crypto24hrHistory ||
  mongoose.model("Crypto24hrHistory", Crypto24hrHistorySchema);

export const Crypto30daysHistory =
  mongoose.models.Crypto30daysHistory ||
  mongoose.model("Crypto30daysHistory", Crypto30daysHistorySchema);

// 1a. Don't forget to add delay for multiple fetch requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// 🌟 Pass targetCoins dynamically as an argument
export const sync24hrHistories = async (
  targetCoins = [
    "bitcoin",
    "ethereum",
    "tether",
    "binancecoin",
    "tron",
    "ripple",
    "solana",
    "dogecoin",
    "hyperliquid",
    "zcash",
  ],
) => {
  // If no array is passed, it defaults to bitcoin and ethereum
  // ["bitcoin", "ethereum", "tether", "binancecoin","tron", "ripple", "solana", "dogecoin","hyperliquid","zcash"];
  for (const coin of targetCoins) {
    try {
      // Throttle delay to protect your free tier limits
      await delay(13000);
      console.log(`⏳ Fetching history for ${coin}...`);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`,
      );

      if (!response.ok) {
        console.error(`⚠️ Skipped ${coin}: Status ${response.status}`);
        continue;
      }

      const data = await response.json();

      const format = data.prices.map((item) => ({
        timestamp: item[0],
        price: item[1],
      }));

      await Crypto24hrHistory.findByIdAndUpdate(
        coin,
        {
          _id: coin,
          last_fetched: new Date(),
          price_history: format,
        },
        { upsert: true },
      );

      console.log(`✅ ${coin} saved!`);
    } catch (error) {
      console.error(`❌ Error on ${coin}:`, error.message);
    }
  }
};

export const sync30daysHistories = async (
  targetCoins = ["bitcoin", "ethereum", "tether", "binancecoin"],
) => {
  // If no array is passed, it defaults to bitcoin and ethereum

  for (const coin of targetCoins) {
    try {
      // Throttle delay to protect your free tier limits
      await delay(13000);
      console.log(`⏳ Fetching history for ${coin}...`);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=30`,
      );

      if (!response.ok) {
        console.error(`⚠️ Skipped ${coin}: Status ${response.status}`);
        continue;
      }

      const data = await response.json();

      const format = data.prices.map((item) => ({
        timestamp: item[0],
        price: item[1],
      }));

      await Crypto30daysHistory.findByIdAndUpdate(
        coin,
        {
          _id: coin,
          last_fetched: new Date(),
          price_history: format,
        },
        { upsert: true },
      );

      console.log(`✅ ${coin} saved!`);
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
//     await sync24hrHistories(uniqueWatchlistCoins);
//   } catch (error) {
//     console.error("Watchlist aggregation failed:", error.message);
//   }
// };
