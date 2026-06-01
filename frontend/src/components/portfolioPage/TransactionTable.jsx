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
        <thead className="bg-white/5">
          <tr>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Asset
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Fees
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Notes
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
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
              {/* Type */}
              <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                <span className={transactionConfig[transaction.transType]?.color}>
                  {transactionConfig[transaction.transType]?.label}
                </span>
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-sm">
                <p className="text-white font-medium">
                  {new Date(transaction.date).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{transaction.time}</p>
              </td>

              {/* Asset */}
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <img
                    src={transaction.coinType?.image}
                    alt={transaction.coinType?.name || "Unknown"}
                    className="w-5 h-5"
                  />
                  <span className="text-white font-medium">
                    {transaction.coinType?.name || "Unknown"}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {transaction.coinType?.symbol?.toUpperCase() || ""}
                  </span>
                </div>
              </td>

              {/* Price */}
              <td className="px-4 py-3 text-white text-sm font-medium">
                ${transaction.pricePerCoin.toLocaleString()}
              </td>

              {/* Amount */}
              <td className="px-4 py-3 text-sm">
                <p className={`font-medium ${transactionConfig[transaction.transType]?.color}`}>
                  {transactionConfig[transaction.transType]?.sign}
                  {transaction.quantity}{" "}
                  {transaction.coinType?.symbol?.toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {(transaction.quantity * transaction.pricePerCoin).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </td>

              {/* Fees */}
              <td className="px-4 py-3 text-gray-400 text-sm font-medium">
                {transaction.fee != null ? `$${transaction.fee}` : "—"}
              </td>

              {/* Notes */}
              <td className="px-4 py-3 text-gray-500 text-sm">
                {transaction.notes || "—"}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setShowTransactionModal(true);
                    }}
                    className="text-gray-500 hover:text-blue-400 cursor-pointer transition"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingTransaction(transaction);
                      setShowDeleteModal(true);
                    }}
                    className="text-gray-500 hover:text-red-400 cursor-pointer transition"
                  >
                    <Trash2 size={15} />
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
