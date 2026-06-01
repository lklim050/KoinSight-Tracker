import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { getMyAssets } from "../services/assetApi.js";
import { getTransactions } from "../services/transactionApi.js";
import { ChevronLeft, Pencil, Trash2, TrendingUp, Layers, Tag, Wallet } from "lucide-react";
import DecryptedText from "../components/ui/DecryptedText.jsx";
import AddTransactionModal from "../components/portfolioPage/AddTransactionModal.jsx";
import DeleteTransactionModal from "../components/portfolioPage/DeleteTransactionModal.jsx";

const AssetDetailPage = ({ user }) => {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assetsData, txData] = await Promise.all([
          getMyAssets(),
          getTransactions(),
        ]);

        // find just THIS asset by its _id
        const found = (assetsData.assets || []).find((a) => a._id === assetId);
        setAsset(found || null);

        // keep only transactions that belong to this asset
        const filtered = (txData.data || []).filter(
          (tx) => tx.coinType?._id === assetId,
        );
        setTransactions(filtered);
      } catch (err) {
        setError("Failed to load asset data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assetId, refreshKey]);

  if (loading) return <p className="text-white pt-24 p-6">Loading...</p>;
  if (error || !asset)
    return <p className="text-white pt-24 p-6">{error || "Asset not found"}</p>;

  return (
    <div className="min-h-screen text-white p-6 pt-24">
      {/* ── Back button ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-gray-400 hover:text-white transition text-sm mb-8 cursor-pointer"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* ── Header row ── */}
      <div className="flex justify-between items-center mb-8">
        {/* Left side */}
        <div>
          {/* Coin name + icon — secondary label */}
          <div className="flex items-center gap-2 mb-3">
            <motion.img
              src={asset.image}
              alt={asset.name}
              className="w-6 h-6 rounded-full"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            />
            <p className="text-sm font-medium text-gray-400">
              {asset.name}
              <span className="text-gray-600 ml-1">
                ({asset.symbol?.toUpperCase()})
              </span>
            </p>
          </div>

          {/* Total holdings — hero number */}
          <p className="text-5xl font-bold text-white tracking-tight">
            <DecryptedText
              text={asset.totalValue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              })}
              animateOn="view"
              sequential={true}
              revealDirection="start"
              speed={40}
              className="text-white"
              encryptedClassName="text-neutral-500"
            />
          </p>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-2">Total Holdings</p>
        </div>

        <button
          onClick={() => {
            setEditingTransaction(null);
            setSelectedCoin({
              _id: asset._id,
              name: asset.name,
              symbol: asset.symbol,
              image: asset.image,
            });
            setShowTransactionModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition cursor-pointer"
        >
          + Add Transaction
        </button>
      </div>
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Total Profit / Loss */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
          <div className="flex items-center gap-1.5 text-gray-500 mb-2">
            <TrendingUp size={12} />
            <p className="text-xs font-medium uppercase tracking-wider">Total Profit / Loss</p>
          </div>
          <div className="flex items-center gap-3">
            <p className={`text-lg font-semibold ${asset.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
              {asset.profitLoss.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              })}
            </p>
            <p className={`text-sm font-semibold ${asset.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
              {asset.profitLoss >= 0 ? "▲" : "▼"}{" "}
              {asset.profitLoss_percentage?.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Quantity */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
          <div className="flex items-center gap-1.5 text-gray-500 mb-2">
            <Layers size={12} />
            <p className="text-xs font-medium uppercase tracking-wider">Quantity</p>
          </div>
          <p className="text-lg font-semibold">
            {asset.holdings} {asset.symbol?.toUpperCase()}
          </p>
        </div>

        {/* Avg Buy Price */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
          <div className="flex items-center gap-1.5 text-gray-500 mb-2">
            <Tag size={12} />
            <p className="text-xs font-medium uppercase tracking-wider">Avg. Buy Price</p>
          </div>
          <p className="text-lg font-semibold">
            {asset.avgBuyPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Cost Basis */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4">
          <div className="flex items-center gap-1.5 text-gray-500 mb-2">
            <Wallet size={12} />
            <p className="text-xs font-medium uppercase tracking-wider">Cost Basis</p>
          </div>
          <p className="text-lg font-semibold">
            {(asset.holdings * asset.avgBuyPrice).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
      {/* ── Transactions ── */}
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400 rounded-3xl bg-white/5 border border-white/10">
          <p className="text-lg mb-2">No transactions yet</p>
          <p className="text-sm">Add a transaction to get started</p>
        </div>
      ) : (
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
              {/* Transaction rows */}
              {transactions.map((tx, idx) => (
                <tr
                  key={`${idx}-${tx._id}`}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 text-sm font-medium">
                    <span
                      className={
                        {
                          buy: "text-green-400",
                          sell: "text-red-400",
                          transfer_in: "text-purple-400",
                          transfer_out: "text-orange-400",
                        }[tx.transType]
                      }
                    >
                      {
                        {
                          buy: "Buy",
                          sell: "Sell",
                          transfer_in: "Transfer In",
                          transfer_out: "Transfer Out",
                        }[tx.transType]
                      }
                    </span>
                  </td>
                  <td className="p-4 text-white text-sm">
                    <p>
                      {new Date(tx.date).toLocaleDateString("en-SG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-400">{tx.time}</p>
                  </td>
                  <td className="p-4 text-white text-sm">
                    {tx.pricePerCoin.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-4 text-sm">
                    <p className="font-semibold text-white">
                      {tx.quantity} {tx.coinType?.symbol?.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(tx.quantity * tx.pricePerCoin).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </td>
                  <td className="p-4 text-white text-sm">{tx.fee ?? "—"}</td>
                  <td className="p-4 text-gray-400 text-sm">
                    {tx.notes || "—"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditingTransaction(tx);
                          setShowTransactionModal(true);
                        }}
                        className="text-gray-400 hover:text-blue-400 cursor-pointer transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingTransaction(tx);
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
      )}

      {showTransactionModal && (
        <AddTransactionModal
          selectedCoin={selectedCoin}
          editingTransaction={editingTransaction}
          setShowTransactionModal={setShowTransactionModal}
          setEditingTransaction={setEditingTransaction}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {showDeleteModal && (
        <DeleteTransactionModal
          deletingTransaction={deletingTransaction}
          setShowDeleteModal={setShowDeleteModal}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default AssetDetailPage;
