import React, { useEffect, useState } from "react";
import { fetchCoins } from "../../services/assetApi.js";

const SelectCoinModalTransaction = ({ setShowModal }) => {
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
      const data = await fetchCoins();

      setCoins(data);
    };

    getCoins();
  }, []);
  return (
    <div
      className="
      fixed
      inset-0
      bg-black/50
      flex
      justify-center
      items-start
      pt-20
      z-50
    "
    >
      <div
        className="
        bg-[#1A1D2E]
        w-full
        max-w-lg
        rounded-3xl
        p-6
       max-h-[70vh]
       overflow-hidden
      "
      >
        <div
          className="
    flex
    justify-between
    items-center
    mb-6
  "
        >
          <p
            className="
      text-white
      text-3xl
      font-bold
    "
          >
            Select Coin
          </p>

          <button
            onClick={() => setShowModal(false)}
            className="
      text-gray-400
      text-4xl
      cursor-pointer
    "
          >
            ×
          </button>
        </div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
    w-full
    bg-[#2A2E45]
    text-white
    px-4
    py-3
    rounded-xl
    outline-none
    mb-6
  "
        />
        <div
          className="space-y-4
    max-h-[500px]
    overflow-y-auto
    hide-scrollbar
    pr-2"
        >
          {filteredCoins.map((coin) => (
            <div
              key={coin.id}
              className="
              flex
              justify-between
              items-center
              hover:bg-[#2A2E45]
              p-3
              rounded-xl
              cursor-pointer
              transition
            "
            >
              <div className="flex items-center gap-3">
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />

                <div className="flex gap-2">
                  <p className="text-white font-semibold">{coin.name}</p>

                  <p className="text-gray-400">{coin.symbol}</p>
                </div>
              </div>

              <p className="text-white text-2xl">›</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCoinModalTransaction;
