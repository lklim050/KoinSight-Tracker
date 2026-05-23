import Auth from "../../models/Auth.js";

export const seedTranactions = async (req, res) => {
  try {
    const userIdFromToken = req.decoded._id.toString();
    const user = await Auth.findById(userIdFromToken);
    if (!user) return res.status(404).json({ msg: "user not found" });
    user.transactions = [];

    const seed = [
      {
        _id: "6a0b0f79e03e3f8a0c7caea6",
        transType: "Buy",
        coinType: "bitcoin",
        quantity: 0.02,
        fee: 2,
        notes: "this is a test transaction to input, does not mean i very rich",
        pricePerCoin: 77600.02,
        date: "2026-06-10",
        time: "14:00",
      },
      {
        _id: "6a0b0f79e03e3f8a0c7caea7",
        transType: "Buy",
        coinType: "bitcoin",
        quantity: 0.02,
        fee: 2,
        notes:
          "this is a test transaction to input, does not mean i very rich plus I am super poor you know",
        pricePerCoin: 77600.01,
        date: "2026-06-12",
        time: "15:00",
      },
      {
        _id: "6a0b0f79e03e3f8a0c7caea8",
        transType: "Buy",
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
        transType: "Sell",
        coinType: "bnb",
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
        transType: "Sell",
        coinType: "solana",
        quantity: 2,
        fee: 2.5,
        notes:
          "this is a test transaction to input, sell liao also not my money",
        pricePerCoin: 86.65,
        date: "2026-05-29",
        time: "14:30",
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
    const userIdFromToken = req.decoded._id.toString();
    const user = await Auth.findById(userIdFromToken);
    if (!user) return res.status(404).json({ msg: "user not found" });
    const trans = {
      transType: req.body.transType,
      coinType: req.body.coinType,
      quantity: req.body.quantity || "",
      pricePerCoin: req.body.pricePerCoin || "",
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
    const userIdFromToken = req.decoded._id.toString();
    const user = await Auth.findById(userIdFromToken).populate(
      "transactions.coinType",
      "id symbol name image current_price market_cap_rank",
    );
    if (!user) return res.status(404).json({ msg: "user not found" });
    res.json({
      status: "fetch successfully",
      user: user.username,
      transactions: user.transactions,
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
    const userIdFromToken = req.decoded._id.toString();
    const user = await Auth.findById(userIdFromToken);
    if (!user) return res.status(404).json({ msg: "user not found" });
    const updated = user.transactions.id(req.params.transId);
    if (!updated) return res.status(404).json({ msg: "entry not found" });
    if ("transType" in req.body) updated.transType = req.body.transType;
    if ("coinType" in req.body) updated.coinType = req.body.coinType;
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
      message: "update successfully",
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
    const userIdFromToken = req.decoded._id.toString();
    const user = await Auth.findById(userIdFromToken);
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
    const userIdFromToken = req.decoded._id.toString();
    const user = await Auth.findById(userIdFromToken).populate(
      "transactions.coinType",
      "id symbol name image current_price market_cap_rank",
    );
    if (!user) return res.status(404).json({ msg: "user not found" });
    const trans = user.transactions.id(req.params.transId);
    if (!trans)
      return res
        .status(404)
        .json({ status: "error", msg: "id does not exist" });
    res.json({
      status: "ok",
      msg: "entry found",
      show: {
        transType: trans.transType,
        coinType: trans.coinType,
        quantity: trans.quantity,
        pricePerCoin: trans.pricePerCoin,
        fee: trans.fee,
        notes: trans.notes,
        date: trans.date,
        time: trans.time,
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
