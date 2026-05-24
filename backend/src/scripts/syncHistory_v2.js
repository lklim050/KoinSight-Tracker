import mongoose from "mongoose";

// this is version 2.0, test cron job result it 1 document with 289 entries for 1 coin to DB

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

const CryptoHistory =
  mongoose.models.CryptoHistory ||
  mongoose.model("CryptoHistory", CryptoHistorySchema);

export const syncBitcoin24hHistory = async () => {
  try {
    console.log(
      "⏰ Cron running: Fetching Bitcoin history into a single document...",
    );

    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1",
    );

    if (!response.ok) throw new Error(`API error! Status: ${response.status}`);
    const data = await response.json();

    // 2. Prepare the single document data payload
    const singleDocumentPayload = {
      _id: "bitcoin",
      coinId: "bitcoin",
      last_fetched: new Date(),
      price_history: data.prices, // 🌟 Simply dump the raw [[timestamp, price]] array straight in!
    };

    // 3. Upsert it! If it exists, overwrite it. If not, create it.
    await CryptoHistory.findByIdAndUpdate("bitcoin", singleDocumentPayload, {
      upsert: true,
      new: true,
    });

    console.log(
      "✅ Success! Compressed historical data points into 1 clean document.",
    );
    return [singleDocumentPayload];
  } catch (error) {
    console.error("❌ Cron Sync failed:", error.message);
    throw error;
  }
};
