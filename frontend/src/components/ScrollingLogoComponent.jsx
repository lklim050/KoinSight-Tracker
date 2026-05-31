import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_SERVER;

export function ScrollingLogoComponent({
  heading = "Track 250+ cryptocurrencies",
}) {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(`${BASE_URL}/db/getTop250`);
        const data = await res.json();
        setCoins((data.show || []).slice(0, 20));
      } catch (err) {
        console.error("Failed to fetch coins", err);
      }
    };
    fetchCoins();
  }, []);

  if (coins.length === 0) return null;

  return (
    <section className="overflow-hidden py-16 md:py-24 lg:py-24">
      {/* Heading */}
      <div className="mb-8 w-full max-w-lg mx-auto px-[5%] md:mb-10 lg:mb-12">
        <h2 className="text-center text-base font-bold text-gray-400">
          {heading}
        </h2>
      </div>

      {/* Scrolling strip */}
      <div
        className="max-w-7xl mx-auto overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
      <div className="flex items-center">
        {[0, 1].map((_, copyIdx) => (
          <div
            key={copyIdx}
            className="flex shrink-0 animate-loop-horizontally items-center"
          >
            {coins.map((coin, idx) => (
              <div
                key={`${copyIdx}-${idx}`}
                className="mx-7 flex shrink-0 flex-col items-center gap-2 md:mx-10"
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-10 w-10 md:h-12 md:w-12"
                />
                <span className="text-xs text-gray-400 font-medium">
                  {coin.symbol?.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
