import { TrendingUp, Wallet, Trophy, AlertTriangle } from "lucide-react";

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
    <div className="grid grid-cols-4 gap-6 mb-8">
      {/* All-time profit */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
        <div className="flex items-center gap-1.5 text-gray-500 mb-2">
          <TrendingUp size={12} />
          <p className="text-xs font-medium uppercase tracking-wider">All-time profit</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className={`${portfolioConfig[status_allTime]?.color} text-xl font-semibold`}>
            {portfolio.allTimeProfitLoss.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center gap-2">
            <p className={`text-sm ${portfolioConfig[status_allTime]?.color}`}>
              {portfolioConfig[status_allTime]?.icon}{" "}
              {portfolio.allTimeProfitLossPercent?.toFixed(3)}%
            </p>
          </div>
        </div>
      </div>

      {/* Cost Basis */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
        <div className="flex items-center gap-1.5 text-gray-500 mb-2">
          <Wallet size={12} />
          <p className="text-xs font-medium uppercase tracking-wider">Cost Basis</p>
        </div>
        <p className="text-xl font-semibold">
          {portfolio.totalPortfolioCost.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Best Performer */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
        <div className="flex items-center gap-1.5 text-gray-500 mb-2">
          <Trophy size={12} />
          <p className="text-xs font-medium uppercase tracking-wider">Best Performer</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={bestPerformer.image}
              alt={bestPerformer.name}
              style={{ width: "20px", height: "20px" }}
            />
            <p className="text-lg font-semibold">
              {bestPerformer.symbol?.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className={`text-base font-semibold ${portfolioConfig[status_profitLossBest]?.color}`}>
              {bestPerformer.profitLoss?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className={`text-sm ${portfolioConfig[status_profitLossBest]?.color}`}>
              {portfolioConfig[status_profitLossBest]?.icon}{" "}
              {bestPerformer.profitLoss_percentage?.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Worst Performer */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
        <div className="flex items-center gap-1.5 text-gray-500 mb-2">
          <AlertTriangle size={12} />
          <p className="text-xs font-medium uppercase tracking-wider">Worst Performer</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={worstPerformer.image}
              alt={worstPerformer.name}
              style={{ width: "20px", height: "20px" }}
            />
            <p className="text-lg font-semibold">
              {worstPerformer.symbol?.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className={`text-base font-semibold ${portfolioConfig[status_profitLossWorst]?.color}`}>
              {worstPerformer.profitLoss?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className={`text-sm ${portfolioConfig[status_profitLossWorst]?.color}`}>
              {portfolioConfig[status_profitLossWorst]?.icon}{" "}
              {worstPerformer.profitLoss_percentage?.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
