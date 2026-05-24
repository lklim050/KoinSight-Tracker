import fs from "fs";
import path from "path";

const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
const targetDir = path.join(process.cwd(), "src", "data");
const targetFile = path.join(targetDir, "coinList.json");

async function fetchAndFilterCoins() {
  try {
    // 1. Create the src/data folder if it does not exist yet
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log("Contacting CoinGecko API for latest data tokens...");
    const response = await fetch(URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const rawData = await response.json();

    // 2. Perform the target KVP filter processing map
    const cleanCoinList = rawData.map((coin) => ({
      _id: coin.id,
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
    }));

    // 3. Output parsed file down into your target path
    fs.writeFileSync(
      targetFile,
      JSON.stringify(cleanCoinList, null, 2),
      "utf-8",
    );
    console.log(`\n✅ File successfully generated at: ${targetFile}`);
    console.log(
      `📊 Filtered and captured the top ${cleanCoinList.length} market coins cleanly!`,
    );
  } catch (error) {
    console.error("❌ Automation script failed:", error.message);
  }
}

fetchAndFilterCoins();
