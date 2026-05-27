import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import { useState, useEffect } from "react";
import { getTransactions } from "../services/transactionApi.js";

export function TransactionTable({ refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const formatTransactionType = (type) => {
    switch (type) {
      case "buy":
        return "Buy";

      case "sell":
        return "Sell";

      case "transfer_in":
        return "Transfer In";

      case "transfer_out":
        return "Transfer Out";

      default:
        return type;
    }
  };
  const transactionConfig = {
    buy: {
      label: "Buy",
      color: "text-green-600",
      sign: "+",
    },
    sell: {
      label: "Sell",
      color: "text-red-600",
      sign: "-",
    },
    transfer_in: {
      label: "Transfer In",
      color: "text-purple-400",
      sign: "+",
    },
    transfer_out: {
      label: "Transfer Out",
      color: "text-orange-400",
      sign: "-",
    },
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactions();
        setTransactions(data.transactions);
      } catch (err) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [refreshTrigger]);

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
          {transactions.map((transaction, idx) => (
            <TableRow
              key={`${idx}-${transaction._id}`}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell className="whitespace-nowrap font-medium">
                <span
                  className={transactionConfig[transaction.transType]?.color}
                >
                  {transactionConfig[transaction.transType]?.label}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 ">
                  <span>
                    {new Date(transaction.date).toLocaleDateString("en-SG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <span>{transaction.time}</span>
                </div>
              </TableCell>
              <TableCell>
                {transaction.coinType?.name || "Unknown"}{" "}
                {transaction.coinType?.symbol?.toUpperCase() || ""}
              </TableCell>
              <TableCell>{transaction.pricePerCoin}</TableCell>
              <TableCell>
                <p
                  className={`${transactionConfig[transaction.transType]?.color} font-semibold`}
                >
                  {transactionConfig[transaction.transType]?.sign}
                  {transaction.quantity}{" "}
                  {transaction.coinType?.symbol?.toUpperCase()}
                </p>

                <p className="text-sm text-gray-400 ">
                  $
                  {(
                    transaction.quantity * transaction.pricePerCoin
                  ).toLocaleString()}
                </p>
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
