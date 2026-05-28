import Assets from "../../models/Portofoilo/Assets.js";
import coinList from "../../data/coinList.json" with { type: "json" };
import UserModel from "../../models/User.js";
import { calculateUserAssets } from "../../utils/calculateUserAssets.js";

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

    const assets = calculateUserAssets(user);

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

export const getPortfolio = async (req, res) => {
  try {
    const userIdFromToken = req.user.id.toString();
    const user = await UserModel.findById(userIdFromToken).populate(
      "transactions.coinType",
      "-__v", // Hides the version tracking key automatically
    );
    if (!user) return res.status(400).json({ msg: "user not found" });
    const assets = calculateUserAssets(user);

    let totalPortfolioCost = 0;
    let totalPortfolioValue = 0;
    let totalPriceChange24h = 0;
    let unrealisedEarning = 0;
    let realisedEarning = 0;

    assets.forEach((asset) => {
      totalPortfolioValue += asset.totalValue; // total value
      totalPortfolioCost += asset.holdings * asset.avgBuyPrice; // cost basis
      totalPriceChange24h +=
        asset.holdings * asset.currentPrice -
        (asset.holdings * asset.currentPrice) /
          (1 + asset.price_change_percentage_24h / 100);
      unrealisedEarning +=
        (asset.currentPrice - asset.avgBuyPrice) * asset.holdings;
      realisedEarning += asset.assetEarning;
    });

    const allocation = assets.map((asset) => {
      const assetCostBasis = asset.avgBuyPrice * asset.holdings;
      const percent =
        totalPortfolioCost > 0
          ? (assetCostBasis / totalPortfolioCost) * 100
          : 0;
      return {
        _id: asset._id,
        percent: Number(percent),
      };
    });

    const totalProfitLoss = totalPortfolioValue - totalPortfolioCost;
    const profitLossPercentage =
      totalPortfolioCost > 0 ? (totalProfitLoss / totalPortfolioCost) * 100 : 0;
    const totalPriceChange24hPercent =
      (totalPriceChange24h / (totalPriceChange24h + totalPortfolioValue)) * 100;
    const allTimeProfitLoss = unrealisedEarning + realisedEarning;

    res.json({
      status: "ok",
      data: {
        totalPortfolioValue: totalPortfolioValue,
        totalPortfolioCost: totalPortfolioCost,
        totalPriceChange24h: totalPriceChange24h,
        totalPriceChange24hPercent: totalPriceChange24hPercent,
        totalProfitLoss: totalProfitLoss,
        profitLossPercentage: profitLossPercentage,
        allTimeProfitLoss: allTimeProfitLoss,
        allocation,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
