import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import { useState, useEffect } from "react";
import { fetchTransactions } from "../services/api.js";

export function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data.transactions);
      } catch (err) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    getTransactions();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      {/* {JSON.stringify(transactions)} */}
      <Table className="w-full">
        <TableHead>
          <TableRow>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Assets</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>Amount</TableHeadCell>
            <TableHeadCell>Fees</TableHeadCell>
            <TableHeadCell>Notes</TableHeadCell>
            <TableHeadCell className="text-right">Actions</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {transactions.map((transaction) => (
            <TableRow
              key={transaction._id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {transaction.transType}
              </TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                {transaction.coinType?.name || "Unknown"}{" "}
                {transaction.coinType?.symbol?.toUpperCase() || ""}
              </TableCell>
              <TableCell>--</TableCell>
              <TableCell>
                <span
                  className={
                    transaction.transType === "Buy"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {transaction.transType === "Buy" ? "+" : "-"}
                  {transaction.quantity}
                </span>
              </TableCell>
              <TableCell>${transaction.fee}</TableCell>
              <TableCell>{transaction.notes}</TableCell>
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
        {/* <TableBody className="divide-y">
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Bitcoin
            </TableCell>
            <TableCell>$70,000(mock)</TableCell>
            <TableCell>12%</TableCell>
            <TableCell>3%</TableCell>
            <TableCell>$2,234.21</TableCell>
            <TableCell>$40,0000</TableCell>
            <TableCell>$5,000(green)</TableCell>
            <TableCell className="text-right">
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Edit
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Ethereum
            </TableCell>
            <TableCell>$70,000(mock)</TableCell>
            <TableCell>12%</TableCell>
            <TableCell>3%</TableCell>
            <TableCell>$2,234.21</TableCell>
            <TableCell>$40,000</TableCell>
            <TableCell>$5,000(green)</TableCell>
            <TableCell className="text-right">
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Edit
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Dogecoin
            </TableCell>
            <TableCell>$70,000(mock)</TableCell>
            <TableCell>12%</TableCell>
            <TableCell>3%</TableCell>
            <TableCell>$2,234.21</TableCell>
            <TableCell>$40,000</TableCell>
            <TableCell>$5,000(green)</TableCell>
            <TableCell className="text-right">
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Edit
              </a>
            </TableCell>
          </TableRow>
        </TableBody> */}
      </Table>
    </div>
  );
}
