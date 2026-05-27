import mongoose from "mongoose";

const TransactionsSchema = new mongoose.Schema({
  transType: { type: String, required: true },
  coinType: { type: String, required: true, ref: "CryptoTop250Coins" },
  quantity: { type: Number, required: true },
  pricePerCoin: { type: Number, required: false, default: 0 },
  fee: { type: Number, required: false },
  notes: { type: String, required: false, maxLength: 200 },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    transactions: [TransactionsSchema],
  },

  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
