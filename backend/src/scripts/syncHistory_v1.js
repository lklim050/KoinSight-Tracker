import mongoose from "mongoose";

// this is version 1.0, test cron job result it 289 documents for 1 coin to DB

// 1. Define a temporary inline schema/model for the historical data points
const PriceHistorySchema = new mongoose.Schema(
  {
    coinId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { collection: "price_histories" },
);

// Fallback to prevent Mongoose model re-compilation errors during hot reloads
const PriceHistory =
  mongoose.models.PriceHistory ||
  mongoose.model("PriceHistory", PriceHistorySchema);

export const syncBitcoin24hHistory = async () => {
  try {
    console.log("⏰ Cron running: Fetching 24-hour Bitcoin data...");

    // 2. Hit the CoinGecko endpoint for 1-day market history
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1",
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error! Status: ${response.status}`);
    }

    const data = await response.json();

    // 3. CoinGecko returns prices as an array of nested arrays: [ [timestamp, price], [timestamp, price] ]
    // Let's format them to match our database fields
    const formattedHistory = data.prices.map(([timestamp, price]) => ({
      coinId: "bitcoin",
      timestamp: new Date(timestamp), // Converts Unix millisecond timestamp to ISO Date
      price: price,
    }));

    // 4. Wipe old historical logs so we keep only a clean snapshot of the last 24 hours
    await PriceHistory.deleteMany({ coinId: "bitcoin" });

    // 5. Bulk insert the clean entries directly into your database
    const result = await PriceHistory.insertMany(formattedHistory);
    console.log(
      `✅ Success! Seeded ${result.length} historical price points into DB.`,
    );

    return result;
  } catch (error) {
    console.error("❌ Cron Sync failed:", error.message);
    throw error;
  }
};
