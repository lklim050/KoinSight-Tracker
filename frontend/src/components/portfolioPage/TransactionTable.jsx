import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getTransactions } from "../../services/transactionApi.js";

export function TransactionTable({
  refreshTrigger,
  user,
  setEditingTransaction,
  setShowTransactionModal,
  setDeletingTransaction,
  setShowDeleteModal,
}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transactionConfig = {
    buy: {
      label: "Buy",
      color: "text-green-400",
      sign: "+",
    },
    sell: {
      label: "Sell",
      color: "text-red-400",
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
    if (!user) {
      return;
    }
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactions();
        setTransactions(data.data || []);
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

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No transactions yet</p>
        <p className="text-sm">Add a transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10">
      <table className="w-full border-collapse">
        <thead className="bg-white/10 backdrop-blur-xl">
          <tr>
            <th className="border-b border-white/10 p-4 text-left text-white text-sm font-semibold">
              Type
            </th>
            <th className="border-b border-white/10 p-4 text-left text-white text-sm font-semibold">
              Date
            </th>
            <th className="border-b border-white/10 p-4 text-left text-white text-sm font-semibold">
              Asset
            </th>
            <th className="border-b border-white/10 p-4 text-left text-white text-sm font-semibold">
              Price
            </th>
            <th className="border-b border-white/10 p-4 text-left text-white text-sm font-semibold">
              Amount
            </th>
            <th className="border-b border-white/10 p-4 text-left text-white text-sm font-semibold">
              Fees
            </th>
            <th className="border-b border-white/10 p-4 text-left text-white text-sm font-semibold">
              Notes
            </th>
            <th className="border-b border-white/10 p-4 text-right text-white text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, idx) => (
            <tr
              key={`${idx}-${transaction._id}`}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td className="p-4 text-sm font-medium whitespace-nowrap">
                <span
                  className={transactionConfig[transaction.transType]?.color}
                >
                  {transactionConfig[transaction.transType]?.label}
                </span>
              </td>
              <td className="p-4 text-white text-sm">
                <div>
                  <p>
                    {new Date(transaction.date).toLocaleDateString("en-SG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-xs text-gray-400">{transaction.time}</p>
                </div>
              </td>
              <td className="p-4 text-white text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={transaction.coinType?.image}
                    alt={transaction.coinType?.name || "Unknown"}
                    className="w-6 h-6"
                  />
                  <span>{transaction.coinType?.name || "Unknown"}</span>
                  <span className="text-gray-400 text-xs">
                    {transaction.coinType?.symbol?.toUpperCase() || ""}
                  </span>
                </div>
              </td>
              <td className="p-4 text-white text-sm">
                ${transaction.pricePerCoin}
              </td>
              <td className="p-4 text-sm">
                <p
                  className={`${transactionConfig[transaction.transType]?.color} font-semibold`}
                >
                  {transactionConfig[transaction.transType]?.sign}
                  {transaction.quantity}{" "}
                  {transaction.coinType?.symbol?.toUpperCase()}
                </p>
                <p className="text-xs text-gray-400">
                  $
                  {(
                    transaction.quantity * transaction.pricePerCoin
                  ).toLocaleString()}
                </p>
              </td>
              <td className="p-4 text-white text-sm">${transaction.fee}</td>
              <td className="p-4 text-gray-400 text-sm">{transaction.notes}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setShowTransactionModal(true);
                    }}
                    className="text-gray-400 hover:text-blue-400 cursor-pointer transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingTransaction(transaction);
                      setShowDeleteModal(true);
                    }}
                    className="text-gray-400 hover:text-red-400 cursor-pointer transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
