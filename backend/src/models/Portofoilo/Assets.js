import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    // We use String for the ID because CoinGecko IDs look like "bitcoin" or "ethereum"
    _id: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    symbol: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    current_price: { type: Number, required: true },
    market_cap_rank: { type: Number, required: true, index: true }, // Index for fast sorting!
  },
  { collection: "assets", timestamps: true },
);

export default mongoose.model("Asset", AssetSchema);
