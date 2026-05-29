import { useState } from "react";
import { createTransaction } from "../../services/transactionApi.js";

function AddTransactionModal({
  selectedCoin,
  setShowTransactionModal,
  onSuccess,
}) {
  const [error, setError] = useState("");
  const [transactionType, setTransactionType] = useState("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(selectedCoin.current_price);
  const [fee, setFee] = useState("");
  const [notes, setNotes] = useState("");
  const [transferType, setTransferType] = useState("Transfer In");
  const [isTransfer, setIsTransfer] = useState(false);
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  const totalSpent =
    (Number(quantity) || 0) * (Number(price) || 0) + (Number(fee) || 0);

  const handleSubmit = async () => {
    const [transactionDate, transactionTime] = date.split("T");

    const newTransaction = {
      transType:
        transactionType === "transfer"
          ? transferType === "Transfer In"
            ? "transfer_in"
            : "transfer_out"
          : transactionType,
      coinType: selectedCoin._id,
      quantity,
      pricePerCoin: isTransfer ? 0 : price,
      fee,
      notes,
      date: transactionDate,
      time: transactionTime,
    };

    const data = await createTransaction(newTransaction);
    if (data.success === false) {
      setError(data.message);
      return;
    }

    onSuccess?.();
    setShowTransactionModal(false);
  };

  const inputClass =
    "w-full bg-white/10 border border-white/20 text-white p-3 rounded-2xl outline-none focus:bg-white/15 focus:border-white/40 placeholder:text-gray-500 transition";

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-start pt-12 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-2xl rounded-3xl p-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-white text-2xl font-bold">Add Transaction</p>
          <button
            onClick={() => setShowTransactionModal(false)}
            className="text-gray-400 hover:text-white text-4xl cursor-pointer transition"
          >
            ×
          </button>
        </div>

        {/* BUY / SELL / TRANSFER TOGGLE */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-0.5 flex mb-4">
          {["buy", "sell", "transfer"].map((type) => (
            <button
              key={type}
              onClick={() => {
                if (type === "transfer") {
                  setIsTransfer(true);
                  setPrice(0);
                } else {
                  setIsTransfer(false);
                }
                setTransactionType(type);
              }}
              className={`flex-1 py-1.5 rounded-xl font-semibold capitalize transition cursor-pointer text-sm
                ${
                  transactionType === type
                    ? "bg-white/20 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* COIN LABEL */}
        <div className="flex items-center gap-2 mt-8 mb-8 text-lg">
          <img
            src={selectedCoin.image}
            alt={selectedCoin.name}
            className="w-7 h-7"
          />
          <p className="text-4xl text-white font-medium">{selectedCoin.name}</p>
          <p className="text-gray-400 text-sm">
            {selectedCoin.symbol.toUpperCase()}
          </p>
        </div>

        {/* TRANSFER TYPE */}
        {transactionType === "transfer" && (
          <div className="mt-3 mb-5">
            <p className="text-gray-300 mb-2 font-medium text-sm">Transfer</p>
            <select
              value={transferType}
              onChange={(e) => setTransferType(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-2xl outline-none focus:bg-white/15 focus:border-white/40 transition"
            >
              <option className="bg-slate-900">Transfer In</option>
              <option className="bg-slate-900">Transfer Out</option>
            </select>
          </div>
        )}

        {/* QUANTITY + PRICE */}
        <div className="grid grid-cols-2 gap-4 mb-4 mt-3">
          <div>
            <p className="text-gray-300 mb-2 font-medium text-sm">Quantity</p>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <p className="text-gray-300 mb-2 font-medium text-sm">
              Price Per Coin $
            </p>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={isTransfer ? 0 : price}
              disabled={isTransfer}
              onChange={(e) => setPrice(e.target.value)}
              className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
        </div>

        {/* DATE / FEE / NOTES */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <p className="text-gray-300 mb-2 font-medium text-sm">
              Date & Time
            </p>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-gray-300 p-2 rounded-2xl outline-none focus:bg-white/15 focus:border-white/40 transition"
            />
          </div>
          <div className="w-32">
            <p className="text-gray-300 mb-2 font-medium text-sm">Fee $</p>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 h-[42px]">
              <span className="text-gray-400 text-sm">$</span>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="bg-transparent text-white outline-none w-full placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-300 mb-2 font-medium text-sm">Notes</p>
            <input
              type="text"
              placeholder="Add notes.."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white p-2 rounded-2xl outline-none focus:bg-white/15 focus:border-white/40 placeholder:text-gray-500 transition"
            />
          </div>
        </div>

        {/* TOTAL */}
        {transactionType !== "transfer" && (
          <div className="bg-white/10 border border-white/20 rounded-3xl p-4 mb-6">
            <p className="text-gray-400 text-sm mb-1">
              {transactionType === "sell" ? "Total Sold" : "Total Bought"}
            </p>
            <p className="text-white text-3xl font-bold">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-2xl cursor-pointer"
        >
          Add Transaction
        </button>
      </div>
    </div>
  );
}

export default AddTransactionModal;
