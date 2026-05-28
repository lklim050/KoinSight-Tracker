// Combine transactions of same coin type and map it accordingly
export const calculateUserAssets = (user) => {
  const assetsMap = {};

  user.transactions.forEach((transaction) => {
    if (!transaction.coinType) return;
    // Define grouping key based on coin id
    const coinId = transaction.coinType._id;

    // Initiate if 1st coin during loop
    if (!assetsMap[coinId]) {
      assetsMap[coinId] = {
        coin: transaction.coinType,
        totalQuantityBought: 0,
        totalQuantitySold: 0,
        totalBuyCost: 0,
        totalSellPrice: 0,
      };
    }

    const principal = transaction.quantity * transaction.pricePerCoin;
    const fee = transaction.fee || 0;

    if (transaction.transType === "buy") {
      assetsMap[coinId].totalQuantityBought += transaction.quantity;
      assetsMap[coinId].totalBuyCost += principal + fee;
    } else if (transaction.transType === "sell") {
      assetsMap[coinId].totalQuantitySold += transaction.quantity;
      assetsMap[coinId].totalSellPrice += principal - fee;
    } else if (transaction.transType === "transfer_in") {
      assetsMap[coinId].totalQuantityBought += transaction.quantity;
    } else if (transaction.transType === "transfer_out") {
      assetsMap[coinId].totalQuantitySold += transaction.quantity;
    }
  });

  return Object.values(assetsMap)
    .map((asset) => {
      const currentHoldings =
        asset.totalQuantityBought - asset.totalQuantitySold;
      const avgBuyPrice =
        asset.totalQuantityBought > 0
          ? asset.totalBuyCost / asset.totalQuantityBought
          : 0;
      const currentCostBasis = currentHoldings * avgBuyPrice;
      const currentPrice = asset.coin.current_price;
      const currentTotalValue = currentHoldings * currentPrice;
      const assetEarning =
        asset.totalSellPrice - asset.totalQuantitySold * avgBuyPrice; // this is realised earning to be accounted for all time profit

      return {
        _id: asset.coin._id,
        name: asset.coin.name,
        symbol: asset.coin.symbol,
        image: asset.coin.image,
        currentPrice: currentPrice,
        holdings: currentHoldings,
        avgBuyPrice: avgBuyPrice,
        totalValue: currentTotalValue,
        profitLoss: currentTotalValue - currentCostBasis,
        profitLoss_percentage:
          (currentTotalValue - currentCostBasis) / currentCostBasis,
        price_change_percentage_1h:
          asset.coin.price_change_percentage_1h_in_currency,
        price_change_percentage_24h:
          asset.coin.price_change_percentage_24h_in_currency,
        price_change_percentage_7d:
          asset.coin.price_change_percentage_7d_in_currency,
        assetEarning: assetEarning,
      };
    })
    .filter((asset) => asset.holdings > 0);
};
