// import Auth from "../../models/Auth.js";
import UserModel from "../../models/User.js";
import { CryptoTop250Coins } from "../../scripts/syncTop250.js";

export const seedTranactions = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    console.log(userIdFromToken);
    const user = await UserModel.findById(userIdFromToken);
    if (!user) return res.status(404).json({ msg: "user not found" });
    user.transactions = [];

    const seed = [
      {
        _id: "6a0b0f79e03e3f8a0c7caea6",
        transType: "buy",
        coinType: "bitcoin",
        quantity: 0.1,
        fee: 2,
        notes: "this is a test transaction to input, does not mean i very rich",
        pricePerCoin: 77500.02,
        date: "2026-06-10",
        time: "14:00",
      },
      {
        _id: "6a0b0f79e03e3f8a0c7caea7",
        transType: "sell",
        coinType: "bitcoin",
        quantity: 0.05,
        fee: 2,
        notes:
          "this is a test transaction to input, does not mean i very rich plus I am super poor you know",
        pricePerCoin: 77598.01,
        date: "2026-06-12",
        time: "15:00",
      },
      {
        _id: "6a0b0f79e03e3f8a0c7caea8",
        transType: "buy",
        coinType: "ethereum",
        quantity: 0.1,
        fee: 2,
        notes:
          "this is a test transaction to input, although this is cheaper but I still no money to buy and I am testing string length as well",
        pricePerCoin: 2127.89,
        date: "2026-05-30",
        time: "09:00",
      },
      {
        _id: "6a0b0f79e03e3f8a0c7caea9",
        transType: "buy",
        coinType: "binancecoin",
        quantity: 2,
        fee: 2.5,
        notes:
          "this is a test transaction to input, sell liao also not my money",
        pricePerCoin: 656.68,
        date: "2026-05-25",
        time: "14:30",
      },
      {
        _id: "6a0b0f79e03e3f8a0c7caeaa",
        transType: "sell",
        coinType: "binancecoin",
        quantity: 0.4,
        fee: 2.5,
        notes:
          "this is a test transaction to input, sell liao also not my money",
        pricePerCoin: 649.18,
        date: "2026-05-25",
        time: "14:30",
      },
      {
        _id: "6a0b0f79e03e3f8a0c7caeab",
        transType: "buy",
        coinType: "solana",
        quantity: 2,
        fee: 2.5,
        notes:
          "this is a test transaction to input, sell liao also not my money",
        pricePerCoin: 86.65,
        date: "2026-05-29",
        time: "14:30",
      },
      {
        _id: "6a0b0f79e03e3f8a0c7caeab",
        transType: "buy",
        coinType: "solana",
        quantity: 3,
        fee: 2.5,
        notes:
          "this is a test transaction to input, sell liao also not my money",
        pricePerCoin: 85.65,
        date: "2026-05-31",
        time: "09:30",
      },
    ];
    user.transactions.push(...seed);
    await user.save();
    res.json({
      status: "ok",
      msg: "seeding success",
      count: `${user.transactions.length} entries created`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "internal server error, check console message",
    });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken);
    if (!user) return res.status(404).json({ msg: "user not found" });
    const trans = {
      transType: req.body.transType,
      coinType: req.body.coinType,
      quantity: req.body.quantity || "",
      pricePerCoin: req.body.pricePerCoin || 0,
      fee: req.body.fee || 0,
      notes: req.body.notes || "",
      date: req.body.date,
      time: req.body.time,
    };
    user.transactions.push(trans);
    await user.save();
    const last = user.transactions.at(-1);
    res.json({
      status: "ok",
      msg: "transaction created successfully",
      create: last,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "internal server error, check console message",
    });
  }
};

export const readAllTransactions = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v",
    );
    if (!user) return res.status(404).json({ msg: "user not found" });

    const data = user.transactions.map((item) => {
      // need to convert item (mongoose doc) to raw json
      const object = item.toObject();
      const value = item.pricePerCoin * item.quantity;
      const fee = item.fee || 0;
      let total = 0;
      if (item.transType === "Buy") {
        total = value + fee; // Cost of buying
      } else if (item.transType === "Sell") {
        total = value - fee; // Cash returned from selling
      } else if (item.transType === "Transfer") {
        total = fee; // If there is any network fee incurred
      }
      return {
        ...object,
        amount: total,
      };
    });

    res.json({
      status: "ok",
      user: user.username,
      // transactions: user.transactions,
      data: data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "internal server error, check console message",
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken);
    if (!user) return res.status(404).json({ msg: "user not found" });
    const updated = user.transactions.id(req.params.transId);
    if (!updated) return res.status(404).json({ msg: "entry not found" });

    if ("quantity" in req.body) updated.quantity = req.body.quantity;
    if ("pricePerCoin" in req.body)
      updated.pricePerCoin = req.body.pricePerCoin;
    if ("fee" in req.body) updated.fee = req.body.fee;
    if ("notes" in req.body) updated.notes = req.body.notes;
    if ("date" in req.body) updated.date = req.body.date;
    if ("time" in req.body) updated.time = req.body.time;
    await user.save();
    res.json({
      status: "ok",
      msg: "update successfully",
      content: updated,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "internal server error, check console message",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken);
    if (!user) return res.status(404).json({ msg: "user not found" });
    user.transactions.pull(req.params.transId);
    await user.save();
    res.json({
      status: "ok",
      msg: "entry deleted",
      content: user.transactions,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "internal server error, check console message",
    });
  }
};

export const postTransaction = async (req, res) => {
  try {
    // to stop using userId at params for security reason
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v",
    );
    if (!user) return res.status(404).json({ msg: "user not found" });
    const trans = user.transactions.id(req.params.transId);
    if (!trans)
      return res
        .status(404)
        .json({ status: "error", msg: "id does not exist" });

    const coinData = await CryptoTop250Coins.findOne(
      { id: trans.coinType },
      "id symbol name image current_price market_cap_rank", // Select only the fields you need
    );

    const cal = trans.pricePerCoin * trans.quantity + (trans.fee || 0);

    res.json({
      status: "ok",
      msg: "entry found",
      data: {
        transType: trans.transType,
        coinType: coinData ? coinData : { id: trans.coinType },
        quantity: trans.quantity,
        pricePerCoin: trans.pricePerCoin,
        fee: trans.fee,
        notes: trans.notes,
        date: trans.date,
        time: trans.time,
        amount: cal,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "internal server error, check console message",
    });
  }
};

// export const getUserAssets = async (req, res) => {
//   try {
//     const transactions = await Transactions.find().populate(
//       "coinType",
//       "id symbol name image current_price",
//     );

//     const assetsMap = {};

//     transactions.forEach((transaction) => {
//       if (!transaction.coinType) return;

//       const coinId = transaction.coinType._id;
//       if (!assetsMap[coinId]) {
//         assetsMap[coinId] = {
//           coin: transaction.coinType,
//           totalQuantity: 0,
//           totalCost: 0,
//           buys: [],
//         };
//       }

//       const amount = transaction.quantity * transaction.pricePerCoin;

//       if (transaction.transType === "Buy") {
//         assetsMap[coinId].totalQuantity += transaction.quantity;
//         assetsMap[coinId].totalCost += amount;
//         assetsMap[coinId].buys.push(transaction);
//       } else {
//         assetsMap[coinId].totalQuantity -= transaction.quantity;
//       }
//     });

//     const assets = Object.values(assetsMap)
//       .filter((asset) => asset.totalQuantity > 0)
//       .map((asset) => {
//         const totalBuyQuantity = asset.buys.reduce(
//           (sum, t) => sum + t.quantity,
//           0,
//         );
//         return {
//           _id: asset.coin._id,
//           name: asset.coin.name,
//           symbol: asset.coin.symbol,
//           image: asset.coin.image,
//           currentPrice: asset.coin.current_price,
//           holdings: asset.totalQuantity,
//           avgBuyPrice:
//             totalBuyQuantity > 0 ? asset.totalCost / totalBuyQuantity : 0,
//           totalValue: asset.totalQuantity * asset.coin.current_price,
//           profitLoss:
//             asset.totalQuantity * asset.coin.current_price - asset.totalCost,
//         };
//       });

//     res.json({
//       status: "success",
//       assets,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Failed to fetch assets" });
//   }
// };
