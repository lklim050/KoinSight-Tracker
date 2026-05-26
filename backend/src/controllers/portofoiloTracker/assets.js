import Assets from "../../models/Portofoilo/Assets.js";
import coinList from "../../data/coinList.json" with { type: "json" };
import UserModel from "../../models/User.js";

export const readAllAssets = async (req, res) => {
  try {
    const allAssets = await Assets.find();
    res.json(allAssets);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to update" });
  }
};

export const seedAssets = async (req, res) => {
  try {
    await Assets.deleteMany({});
    const data = coinList.map((coin) => ({
      _id: coin.id, // Sets "bitcoin" as the primary key for direct referencing!
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price || 0, // Fallbacks in case keys are empty
      market_cap_rank: coin.market_cap_rank || 999,
    }));

    const seed = await Assets.create(data);
    res.json({
      status: "ok",
      msg: `seed successfully, ${seed.length} entries created`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ status: "error", msg: "fail to seed" });
  }
};

export const getAssets = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v", // Hides the version tracking key automatically
    );
    if (!user) return res.status(400).json({ msg: "user not found" });

    const assetsMap = {};

    user.transactions.forEach((transaction) => {
      // If the coin data didn't populate correctly, skip it
      if (!transaction.coinType) return;

      // Use the unique coin identifier (e.g., "bitcoin") as the grouping key
      const coinId = transaction.coinType._id;

      // 2. Initialize the coin group if it's the first time we encounter it
      if (!assetsMap[coinId]) {
        assetsMap[coinId] = {
          coin: transaction.coinType,
          totalQuantityBought: 0,
          totalQuantitySold: 0,
          totalBuyCost: 0,
        };
      }

      // 3. Separate calculation logic by transaction type
      const principal = transaction.quantity * transaction.pricePerCoin;
      const fee = transaction.fee || 0;

      if (transaction.transType === "Buy") {
        assetsMap[coinId].totalQuantityBought += transaction.quantity;
        // Fees increase your total historical capital layout cost
        assetsMap[coinId].totalBuyCost += principal + fee;
      } else if (transaction.transType === "Sell") {
        assetsMap[coinId].totalQuantitySold += transaction.quantity;
      }
      // Note: "Transfer" can be safely ignored here as it doesn't affect raw holdings inventory
    });

    const assets = Object.values(assetsMap)
      .map((asset) => {
        // Current net holding remaining
        const currentHoldings =
          asset.totalQuantityBought - asset.totalQuantitySold;

        // Average price paid to buy this asset historically
        const avgBuyPrice =
          asset.totalQuantityBought > 0
            ? asset.totalBuyCost / asset.totalQuantityBought
            : 0;

        // The capital value currently tied up in the asset position
        const currentCostBasis = currentHoldings * avgBuyPrice;

        // Real-time market valuation of remaining units
        const currentTotalValue = currentHoldings * asset.coin.current_price;

        return {
          _id: asset.coin._id,
          name: asset.coin.name,
          symbol: asset.coin.symbol,
          image: asset.coin.image,
          currentPrice: asset.coin.current_price,
          holdings: currentHoldings,
          avgBuyPrice: avgBuyPrice,
          totalValue: currentTotalValue,
          profitLoss: currentTotalValue - currentCostBasis,
          price_change_percentage_1h:
            asset.coin.price_change_percentage_1h_in_currency,
          price_change_percentage_24h:
            asset.coin.price_change_percentage_24h_in_currency,
          price_change_percentage_7d:
            asset.coin.price_change_percentage_7d_in_currency,
        };
      })
      // Optional: Filter out assets the user has fully sold off (holdings <= 0)
      .filter((asset) => asset.holdings > 0);

    res.json({
      status: "ok",
      assets,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "ok",
      msg: "Internal server failed, please check console log",
    });
  }
};
