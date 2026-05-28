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

    console.log("Transaction:");
    console.log(newTransaction);

    const data = await createTransaction(newTransaction);
    if (data.success === false) {
      setError(data.message);
      return;
    }

    onSuccess?.();
    setShowTransactionModal(false);
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-12 z-50 ">
      <div className=" bg-[#1A1D2E] w-full max-w-2xl rounded-3xl p-6 ">
        {/* HEADER */}

        <div className="flex justify-between items-center  mb-5 ">
          <p className=" text-white text-2xl font-bold ">Add Transaction</p>
          <button
            onClick={() => setShowTransactionModal(false)}
            className="text-gray-400 text-4xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* BUY / SELL / TRANSFER */}

        <div className="bg-[#2A2E45] rounded-2xl p-0.5 flex mb-3 ">
          {["buy", "sell", "transfer"].map((type) => (
            <button
              key={type}
              onClick={() => {
                if (type === "transfer") {
                  setIsTransfer(true);
                  setPrice(0); // 👈 Force your input state to 0 immediately for the UI!
                } else {
                  setIsTransfer(false);
                }
                setTransactionType(type);
              }}
              className={`flex-1 py-0.5 rounded-xl font-semibold capitalize transition cursor-pointer  
                ${
                  transactionType === type
                    ? "bg-[#1A1D2E] text-white"
                    : "text-gray-400"
                }
        `}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ">
          <img
            src={selectedCoin.image}
            alt={selectedCoin.name}
            className="w-7 h-7"
          />

          <div className="flex gap-2  ">
            <p className="text-blue-600 text-2lg font-bold ">
              {selectedCoin.name}
            </p>

            <p className="text-gray-400 text-2l ">
              {selectedCoin.symbol.toUpperCase()}
            </p>
          </div>
        </div>
        {/* TRANSFER TYPE */}

        {transactionType === "transfer" && (
          <div className="mt-3 mb-5">
            <p className="text-gray-300 mb-4 font-medium">Transfer</p>

            <select
              value={transferType}
              onChange={(e) => setTransferType(e.target.value)}
              className="w-full bg-[#2A2E45] text-white  p-3 rounded-2xl outline-none"
            >
              <option>Transfer In</option>

              <option>Transfer Out</option>
            </select>
          </div>
        )}

        {/* QUANTITY + PRICE */}

        <div className=" grid grid-cols-2 gap-4 mb-5 mt-3 ">
          {/* QUANTITY */}

          <div>
            <p className="text-gray-300 mb-4 font-medium ">Quantity</p>

            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-[#2A2E45] text-white p-3 rounded-2xl outline-none"
            />
          </div>

          {/* PRICE */}

          <div>
            <p className="text-gray-300 mb-4 font-medium ">Price Per Coin $</p>

            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={isTransfer ? 0 : price}
              disabled={isTransfer}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#2A2E45] text-white p-3 rounded-2xl outline-none "
            />
          </div>
        </div>
        <div className="flex gap-4 mb-8 ">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 bg-[#2A2E45] text-gray-300 p-2 rounded-2xl outline-none "
          />
          <div className="flex items-center gap-2 bg-[#2A2E45] rounded-2xl px-4 w-32">
            <span className="text-gray-300 text-2lg ">$</span>

            <input
              type="number"
              min="0"
              step="any"
              placeholder="Fee"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="bg-transparent text-white outline-none w-full py-0.5"
            />
          </div>
          <input
            type="text"
            placeholder="Notes to add.."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="flex-1 bg-[#2A2E45] text-white p-2 rounded-2xl outline-none placeholder:text-gray-500 "
          />
        </div>
        {transactionType !== "transfer" && (
          <div className="bg-[#2A2E45] rounded-3xl p-3 mb-6">
            <p className="text-gray-400 text-xl mb-2 ">
              {transactionType === "sell" ? "Total Received" : "Total Spent"}
            </p>

            <p className="text-white text-3xl font-bold ">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
        )}
        {error && <p className="text-red-400 mb-4 ">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white text-2lg font-semibold py-3 rounded-2xl cursor-pointer "
        >
          Add Transaction
        </button>
      </div>
    </div>
  );
}

export default AddTransactionModal;
