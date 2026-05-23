import mongoose from "mongoose";

const TransactionsSchema = new mongoose.Schema(
  {
    transType: { type: String, required: true },
    coinType: { type: String, required: true, ref: "Asset" },
    quantity: { type: Number, required: true },
    pricePerCoin: { type: Number, required: true },
    fee: { type: Number, required: false },
    notes: { type: String, required: false, maxLength: 200 },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "transactions" },
);

export default mongoose.model("Transaction", TransactionsSchema);
