import { useState, useEffect } from "react";
import { getMyAssets } from "../../services/assetApi.js";
import { useNavigate } from "react-router-dom";

export function AssetsTable({ user, refreshTrigger, getAssetToPortfolio }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const getAssets = async () => {
      try {
        const data = await getMyAssets();
        console.log("Assets data:", data);
        setAssets(data.assets);
        getAssetToPortfolio(data.assets);
      } catch (err) {
        setError("Failed to load assets");
      } finally {
        setLoading(false);
      }
    };
    getAssets();
  }, [refreshTrigger]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No assets yet</p>
        <p className="text-sm">
          Add a transaction to start tracking your portfolio
        </p>
      </div>
    );
  }

  const assetConfig = {
    positive: {
      color: "text-green-400",
      icon: "▲",
      sign: "+",
    },
    negative: {
      color: "text-red-400",
      icon: "▼",
      sign: "-",
    },
    neutral: {
      color: "text-gray-500",
      icon: "-",
      sign: " ",
    },
  };

  return (
    <div className="overflow-x-auto rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10">
      <table className="w-full border-collapse">
        <thead className="bg-white/5">
          <tr>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              1h%
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              24h%
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              7d%
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Holdings
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Avg. Buy Price
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Profit/Loss
            </th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, idx) => {
            const percent_1h = asset.price_change_percentage_1h;
            const percent_24h = asset.price_change_percentage_24h;
            const percent_7d = asset.price_change_percentage_7d;
            const status_1h = !percent_1h
              ? "neutral"
              : percent_1h > 0
                ? "positive"
                : "negative";
            const status_24h = !percent_24h
              ? "neutral"
              : percent_24h > 0
                ? "positive"
                : "negative";
            const status_7d = !percent_7d
              ? "neutral"
              : percent_7d > 0
                ? "positive"
                : "negative";
            const status_profitLoss = !asset.profitLoss
              ? "neutral"
              : asset.profitLoss > 0
                ? "positive"
                : "negative";

            return (
              <tr
                key={`${idx}-${asset._id}`}
                onClick={() => navigate(`/asset/${asset._id}`)}
                className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
              >
                {/* Name */}
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-medium">{asset.name}</span>
                    <span className="text-gray-500 text-xs">
                      {asset.symbol?.toUpperCase()}
                    </span>
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-white text-sm font-medium">
                  ${asset.currentPrice.toLocaleString()}
                </td>

                {/* 1h% */}
                <td className={`px-4 py-3 text-sm font-medium ${assetConfig[status_1h]?.color}`}>
                  {assetConfig[status_1h]?.icon}{" "}
                  {percent_1h ? percent_1h.toFixed(2) : "--"}%
                </td>

                {/* 24h% */}
                <td className={`px-4 py-3 text-sm font-medium ${assetConfig[status_24h]?.color}`}>
                  {assetConfig[status_24h]?.icon}{" "}
                  {percent_24h ? percent_24h.toFixed(2) : "--"}%
                </td>

                {/* 7d% */}
                <td className={`px-4 py-3 text-sm font-medium ${assetConfig[status_7d]?.color}`}>
                  {assetConfig[status_7d]?.icon}{" "}
                  {percent_7d ? percent_7d.toFixed(2) : "--"}%
                </td>

                {/* Holdings */}
                <td className="px-4 py-3 text-sm">
                  <p className="text-white font-medium">
                    {asset.holdings} {asset.symbol?.toUpperCase()}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {(asset.holdings * asset.avgBuyPrice).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </p>
                </td>

                {/* Avg. Buy Price */}
                <td className="px-4 py-3 text-white text-sm font-medium">
                  {asset.avgBuyPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                {/* Profit/Loss */}
                <td className={`px-4 py-3 text-sm ${assetConfig[status_profitLoss]?.color}`}>
                  <p className="font-semibold">
                    {asset.profitLoss.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs mt-0.5">
                    {assetConfig[status_profitLoss]?.icon}
                    {asset.profitLoss_percentage.toFixed(2)}%
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
