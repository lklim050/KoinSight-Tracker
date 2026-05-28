import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { fetchMyAssets } from "../services/api.js";
import { getMyAssets } from "../services/transactionApi.js";

export function AssetsTable({ user, refreshTrigger }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const getAssets = async () => {
      try {
        const data = await getMyAssets();
        console.log("Assets data:", data);
        setAssets(data.assets);
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
      color: "text-green-600",
      sign: "▲",
    },
    negative: {
      color: "text-red-600",
      sign: "▼",
    },
    neutral: {
      color: "text-grey-400",
      sign: "-",
    },
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>1h%</TableHeadCell>
            <TableHeadCell>24h%</TableHeadCell>
            <TableHeadCell>7d%</TableHeadCell>
            <TableHeadCell>Holdings</TableHeadCell>
            <TableHeadCell>Avg.Buy Price</TableHeadCell>
            <TableHeadCell>Profit/Loss</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
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
              <TableRow
                key={`${idx}-${asset._id}`}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    style={{ width: "24px", height: "24px" }}
                  />
                  {asset.name}, {asset.symbol?.toUpperCase()}
                </TableCell>
                <TableCell className="font-semibold">
                  ${asset.currentPrice.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`${assetConfig[status_1h]?.color} font-semibold`}
                >
                  {assetConfig[status_1h]?.sign}{" "}
                  {percent_1h ? percent_1h.toFixed(2) : "--"}
                </TableCell>
                <TableCell
                  className={`${assetConfig[status_24h]?.color} font-semibold`}
                >
                  {assetConfig[status_24h]?.sign}{" "}
                  {percent_24h ? percent_24h.toFixed(2) : "--"}
                </TableCell>
                <TableCell
                  className={`${assetConfig[status_7d]?.color} font-semibold`}
                >
                  {assetConfig[status_7d]?.sign}{" "}
                  {percent_7d ? percent_7d.toFixed(2) : "--"}
                </TableCell>
                <TableCell className="font-semibold">
                  {asset.holdings}
                </TableCell>
                <TableCell className="font-semibold">
                  ${asset.avgBuyPrice.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`${assetConfig[status_profitLoss]?.color} font-semibold`}
                >
                  ${asset.profitLoss.toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
