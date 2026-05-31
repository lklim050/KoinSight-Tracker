import mongoose from "mongoose";
import UserModel from "../models/User.js";

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

// Add delay for multiple fetch requests to counter the 3rd party API rate limit
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// 🌟 Pass targetCoins dynamically as an argument
export const sync24hrHistories = async (
  targetCoins = ["bitcoin", "ethereum", "tether", "binancecoin"],
) => {
  // If no array is passed, it defaults to bitcoin and ethereum
  // ["bitcoin", "ethereum", "tether", "binancecoin"];
  for (const coin of targetCoins) {
    try {
      // Throttle delay to protect your free tier limits
      await delay(13000);
      console.log(`⏳ Fetching history for ${coin}...`);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`,
      );

      if (!response.ok) {
        console.error(`❌ Skipped ${coin}: Status ${response.status}`);
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
        console.error(`❌ Skipped ${coin}: Status ${response.status}`);
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
