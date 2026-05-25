import Transactions from "../../models/Portofoilo/Transactions.js";
import Assets from "../../models/Portofoilo/Assets.js";

// export const seedTranactions = async (req, res) => {
//   try {
//     await Transactions.deleteMany({});
//     const seed = await Transactions.create([
//       {
//         _id: "6a0b0f79e03e3f8a0c7caea6",
//         transType: "Buy",
//         coinType: "bitcoin",
//         quantity: 0.02,
//         fee: 2,
//         notes: "this is a test transaction to input, does not mean i very rich",
//         pricePerCoin: 77600.02,
//         date: "2026-06-10",
//         time: "14:00",
//       },
//       {
//         _id: "6a0b0f79e03e3f8a0c7caea7",
//         transType: "Buy",
//         coinType: "bitcoin",
//         quantity: 0.02,
//         fee: 2,
//         notes:
//           "this is a test transaction to input, does not mean i very rich plus I am super poor you know",
//         pricePerCoin: 77600.01,
//         date: "2026-06-12",
//         time: "15:00",
//       },
//       {
//         _id: "6a0b0f79e03e3f8a0c7caea8",
//         transType: "Buy",
//         coinType: "ethereum",
//         quantity: 0.1,
//         fee: 2,
//         notes:
//           "this is a test transaction to input, although this is cheaper but I still no money to buy and I am testing string length as well",
//         pricePerCoin: 2127.89,
//         date: "2026-05-30",
//         time: "09:00",
//       },
//       {
//         _id: "6a0b0f79e03e3f8a0c7caea9",
//         transType: "Sell",
//         coinType: "bnb",
//         quantity: 2,
//         fee: 2.5,
//         notes:
//           "this is a test transaction to input, sell liao also not my money",
//         pricePerCoin: 656.68,
//         date: "2026-05-25",
//         time: "14:30",
//       },
//       {
//         _id: "6a0b0f79e03e3f8a0c7caeaa",
//         transType: "Sell",
//         coinType: "solana",
//         quantity: 2,
//         fee: 2.5,
//         notes:
//           "this is a test transaction to input, sell liao also not my money",
//         pricePerCoin: 86.65,
//         date: "2026-05-29",
//         time: "14:30",
//       },
//     ]);
//     res.json({
//       status: "ok",
//       msg: "seeding success",
//       count: `${seed.length} entries created`,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(404).json({ status: "error", msg: "fail to seed data" });
//   }
// };

export const seedTranactions = async (req, res) => {
  try {
    await Transactions.deleteMany({});

    const bitcoin = await Assets.findOne({ id: "bitcoin" });
    const ethereum = await Assets.findOne({ id: "ethereum" });
    const bnb = await Assets.findOne({ id: "binancecoin" });
    const solana = await Assets.findOne({ id: "solana" });

    const dummyUserId = "507f1f77bcf86cd799439011";

    const seed = await Transactions.create([
      {
        userId: dummyUserId,
        transType: "Buy",
        coinType: bitcoin._id,
        quantity: 0.02,
        fee: 2,
        notes: "this is a test transaction to input, does not mean i very rich",
        pricePerCoin: 77600.02,
        date: "2026-06-10",
        time: "14:00",
      },
      {
        userId: dummyUserId,
        transType: "Buy",
        coinType: bitcoin._id,
        quantity: 0.02,
        fee: 2,
        notes:
          "this is a test transaction to input, does not mean i very rich plus I am super poor you know",
        pricePerCoin: 77600.01,
        date: "2026-06-12",
        time: "15:00",
      },
      {
        userId: dummyUserId,
        transType: "Buy",
        coinType: ethereum._id,
        quantity: 0.1,
        fee: 2,
        notes:
          "this is a test transaction to input, although this is cheaper but I still no money to buy and I am testing string length as well",
        pricePerCoin: 2127.89,
        date: "2026-05-30",
        time: "09:00",
      },
      {
        userId: dummyUserId,
        transType: "Sell",
        coinType: bnb._id,
        quantity: 2,
        fee: 2.5,
        notes:
          "this is a test transaction to input, sell liao also not my money",
        pricePerCoin: 656.68,
        date: "2026-05-25",
        time: "14:30",
      },
      {
        userId: dummyUserId,
        transType: "Sell",
        coinType: solana._id,
        quantity: 2,
        fee: 2.5,
        notes:
          "this is a test transaction to input, sell liao also not my money",
        pricePerCoin: 86.65,
        date: "2026-05-29",
        time: "14:30",
      },
    ]);
    res.json({
      status: "ok",
      msg: "seeding success",
      count: `${seed.length} entries created`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to seed data" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const trans = await Transactions.create({
      transType: req.body.transType,
      coinType: req.body.coinType,
      quantity: req.body.quantity,
      pricePerCoin: req.body.pricePerCoin,
      fee: req.body.fee,
      notes: req.body.notes,
      date: req.body.date,
      time: req.body.time,
    });

    const show = await trans.populate("coinType", "id name symbol moreno");
    res.json({
      status: "ok",
      msg: "new transaction created successfully",
      show: {
        transType: show.transType,
        coinType: show.coinType,
        quantity: show.quantity,
        pricePerCoin: show.pricePerCoin,
        fee: show.fee,
        notes: show.notes,
        date: show.date,
        time: show.time,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to create" });
  }
};

export const readAllTransactions = async (req, res) => {
  try {
    const all = await Transactions.find().populate(
      "coinType",
      "id symbol name image",
    );
    res.json({
      status: "fetch successfully",
      transactions: all,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json("cannot fetch data");
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const updated = {};
    if ("transType" in req.body) updated.transType = req.body.transType;
    if ("coinType" in req.body) updated.coinType = req.body.coinType;
    if ("quantity" in req.body) updated.quantity = req.body.quantity;
    if ("pricePerCoin" in req.body)
      updated.pricePerCoin = req.body.pricePerCoin;
    if ("fee" in req.body) updated.fee = req.body.fee;
    if ("notes" in req.body) updated.notes = req.body.notes;
    if ("date" in req.body) updated.date = req.body.date;
    if ("time" in req.body) updated.time = req.body.time;

    const trans = await Transactions.findByIdAndUpdate(
      req.params.transId,
      updated,
      { new: true },
    );
    const show = await trans.populate("coinType", "id name symbol image");
    res.json({
      status: "ok",
      msg: "update successfully",
      show: {
        transType: show.transType,
        coinType: show.coinType,
        quantity: show.quantity,
        pricePerCoin: show.pricePerCoin,
        fee: show.fee,
        notes: show.notes,
        date: show.date,
        time: show.time,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to update" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const found = await Transactions.findById(req.params.transId);
    if (!found)
      return res
        .status(404)
        .json({ status: "error", msg: "id does not exist" });
    const deleted = await Transactions.findByIdAndDelete(req.params.transId);
    res.json({
      status: "ok",
      msg: `entry [${found.transType} ${found.coinType}] deleted successfully `,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to delete" });
  }
};

export const postTransaction = async (req, res) => {
  try {
    const trans = await Transactions.findById(req.params.transId);
    if (!trans)
      return res
        .status(404)
        .json({ status: "error", msg: "id does not exist" });
    const show = await trans.populate("coinType", "id name symbol image");
    res.json({
      status: "ok",
      msg: "entry found",
      show: {
        transType: show.transType,
        coinType: show.coinType,
        quantity: show.quantity,
        pricePerCoin: show.pricePerCoin,
        fee: show.fee,
        notes: show.notes,
        date: show.date,
        time: show.time,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to find" });
  }
};

export const getUserAssets = async (req, res) => {
  try {
    const transactions = await Transactions.find().populate(
      "coinType",
      "id symbol name image current_price",
    );

    const assetsMap = {};

    transactions.forEach((transaction) => {
      if (!transaction.coinType) return;

      const coinId = transaction.coinType._id;
      if (!assetsMap[coinId]) {
        assetsMap[coinId] = {
          coin: transaction.coinType,
          totalQuantity: 0,
          totalCost: 0,
          buys: [],
        };
      }

      const amount = transaction.quantity * transaction.pricePerCoin;

      if (transaction.transType === "Buy") {
        assetsMap[coinId].totalQuantity += transaction.quantity;
        assetsMap[coinId].totalCost += amount;
        assetsMap[coinId].buys.push(transaction);
      } else {
        assetsMap[coinId].totalQuantity -= transaction.quantity;
      }
    });

    const assets = Object.values(assetsMap)
      .filter((asset) => asset.totalQuantity > 0)
      .map((asset) => {
        const totalBuyQuantity = asset.buys.reduce(
          (sum, t) => sum + t.quantity,
          0,
        );
        return {
          _id: asset.coin._id,
          name: asset.coin.name,
          symbol: asset.coin.symbol,
          image: asset.coin.image,
          currentPrice: asset.coin.current_price,
          holdings: asset.totalQuantity,
          avgBuyPrice:
            totalBuyQuantity > 0 ? asset.totalCost / totalBuyQuantity : 0,
          totalValue: asset.totalQuantity * asset.coin.current_price,
          profitLoss:
            asset.totalQuantity * asset.coin.current_price - asset.totalCost,
        };
      });

    res.json({
      status: "success",
      assets,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch assets" });
  }
};
