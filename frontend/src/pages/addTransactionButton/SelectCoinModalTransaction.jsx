import React from "react";

const SelectCoinModalTransaction = ({ setShowModal }) => {
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
      </div>
    </div>
  );
};

export default SelectCoinModalTransaction;
