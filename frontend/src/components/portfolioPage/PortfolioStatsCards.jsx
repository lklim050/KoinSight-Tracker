export function PortfolioStatsCards({
  portfolio,
  portfolioConfig,
  status_allTime,
  bestPerformer,
  worstPerformer,
  status_profitLossBest,
  status_profitLossWorst,
}) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {/* All-time profit */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <h4 className="text-gray-400 text-sm mb-2">All-time profit</h4>
        <p
          className={`${portfolioConfig[status_allTime]?.color} text-2xl mb-2 font-semibold`}
        >
          {portfolio.allTimeProfitLoss.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p
          className={`${portfolioConfig[status_allTime]?.color} text-sm font-semibold`}
        >
          {portfolioConfig[status_allTime]?.icon}{" "}
          {portfolio.allTimeProfitLossPercent?.toFixed(3)}%
        </p>
      </div>

      {/* Cost Basis */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <h4 className="text-gray-400 text-sm mb-2">Cost Basis</h4>
        <p className="text-2xl font-bold">
          {portfolio.totalPortfolioCost.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Best / Worst Performer */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-gray-400 text-sm mb-2">Best Performer</h4>
            <div className="flex flex-row gap-3">
              <img
                src={bestPerformer.image}
                alt={bestPerformer.name}
                style={{ width: "24px", height: "24px" }}
              />
              <p className="text-lg font-bold mb-2">
                {bestPerformer.symbol?.toUpperCase()}
              </p>
            </div>
            <p className={`${portfolioConfig[status_profitLossBest]?.color}`}>
              {bestPerformer.profitLoss?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {portfolioConfig[status_profitLossBest]?.sign}{" "}
              {bestPerformer.profitLoss_percentage?.toFixed(2)}%
            </p>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm mb-2">Worst Performer</h4>
            <div className="flex flex-row gap-3 mb-2">
              <img
                src={worstPerformer.image}
                alt={worstPerformer.name}
                style={{ width: "24px", height: "24px" }}
              />
              <p className="text-lg font-bold">
                {worstPerformer.symbol?.toUpperCase()}
              </p>
            </div>
            <p className={`${portfolioConfig[status_profitLossWorst]?.color}`}>
              {worstPerformer.profitLoss?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {portfolioConfig[status_profitLossWorst]?.sign}{" "}
              {worstPerformer.profitLoss_percentage?.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
