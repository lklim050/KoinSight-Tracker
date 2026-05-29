import React, { useEffect, useState } from "react";
import { getTop250Coins } from "../../services/coinApi.js";

const SelectCoinModalTransaction = ({
  setShowCoinModal,
  setSelectedCoin,
  setShowTransactionModal,
}) => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const filteredCoins = coins.filter((coin) => {
    const searchTerm = search.toLowerCase();

    return (
      coin.name.toLowerCase().includes(searchTerm) ||
      coin.symbol.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    const getCoins = async () => {
      try {
        const data = await getTop250Coins();

        setCoins(data);
      } catch (error) {
        console.error(error);
      }
    };

    getCoins();
  }, []);
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-start pt-20 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-lg rounded-3xl p-6 max-h-[70vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-white text-2xl font-bold">Select Coin</p>
          <button
            onClick={() => setShowCoinModal(false)}
            className="text-gray-400 hover:text-white text-4xl cursor-pointer transition"
          >
            ×
          </button>
        </div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl outline-none mb-6 focus:bg-white/15 focus:border-white/40 placeholder:text-gray-500 transition"
        />
        <div className="space-y-1 max-h-[500px] overflow-y-auto hide-scrollbar pr-2" data-lenis-prevent>
          {filteredCoins.map((coin, idx) => (
            <div
              key={`${idx}-${coin.id}`}
              onClick={() => {
                setSelectedCoin(coin);
                setShowCoinModal(false);
                setShowTransactionModal(true);
              }}
              className="flex justify-between items-center hover:bg-white/10 p-3 rounded-xl cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div className="flex gap-2">
                  <p className="text-white font-semibold">{coin.name}</p>
                  <p className="text-gray-400 text-sm">{coin.symbol}</p>
                </div>
              </div>
              <p className="text-gray-400 text-2xl">›</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCoinModalTransaction;
