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

export function AssetsTable() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>24h%</TableHeadCell>
            <TableHeadCell>7d%</TableHeadCell>
            <TableHeadCell>Holdings</TableHeadCell>
            <TableHeadCell>Avg.Buy Price</TableHeadCell>
            <TableHeadCell>Profit/Loss</TableHeadCell>
            <TableHeadCell className="text-right">Action</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {assets.map((asset, idx) => (
            <TableRow
              key={`${idx}-${asset._id}`}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {asset.name} {asset.symbol}
              </TableCell>
              <TableCell>${asset.currentPrice.toLocaleString()}</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
              <TableCell>{asset.holdings}</TableCell>
              <TableCell>${asset.avgBuyPrice.toLocaleString()}</TableCell>
              <TableCell
                className={
                  asset.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                ${asset.profitLoss.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Edit
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
