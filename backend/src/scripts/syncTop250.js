import mongoose from "mongoose";

const CryptoTop250CoinsSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    current_price: { type: Number, required: true },
    market_cap: { type: Number, required: true },
    market_cap_rank: { type: Number, required: true },
    fully_diluted_valuation: { type: Number, required: true },
    total_volume: { type: Number, required: true },
    high_24h: { type: Number, default: 0 },
    low_24h: { type: Number, default: 0 },
    price_change_24h: { type: Number, default: 0 },
    price_change_percentage_24h: { type: Number, default: 0 },
    market_cap_change_24h: { type: Number, default: 0 },
    market_cap_change_percentage_24h: { type: Number, default: 0 },
    last_updated: { type: Date, required: true },
    price_change_percentage_1h_in_currency: { type: Number, default: 0 },
    price_change_percentage_24h_in_currency: { type: Number, default: 0 },
    price_change_percentage_7d_in_currency: { type: Number, default: 0 },
  },
  { collection: "crypto_top250Coins" },
);

export const CryptoTop250Coins =
  mongoose.models.CryptoTop250Coins ||
  mongoose.model("CryptoTop250Coins", CryptoTop250CoinsSchema);

// Add delay for multiple fetch requests to counter the 3rd party API rate limit
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const syncTop250coins = async () => {
  try {
    await delay(13000);
    console.log(`⏳ Fetching Top 250...`);
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
    );

    if (!res.ok) {
      console.error(`❌ Status ${res.status}`);
    }

    const data = await res.json();

    // this is a DB command for writing 250 documents efficiently
    // instead of using delete and create in case some undefined data fetched
    const bulk = data.map((item) => {
      const updated = {};
      for (const [key, value] of Object.entries(item)) {
        if (value !== null && value !== undefined) {
          updated[key] = value;
        }
      }

      updated._id = item.id;

      return {
        updateOne: {
          filter: { _id: item.id },
          update: { $set: updated },
          upsert: true,
        },
      };
    });
    const result = await CryptoTop250Coins.bulkWrite(bulk);

    console.log(
      `✅ Top250 saved! Total updated: ${result.upsertedCount + result.modifiedCount}`,
    );
    return data;
  } catch (error) {
    console.error(`❌ Error: `, error.message);
    throw error;
  }
};
