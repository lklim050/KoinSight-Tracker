import Assets from "../../models/Portofoilo/Assets.js";
import coinList from "../../data/coinList.json" with { type: "json" };

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
