import { Tabs } from "../ui/tabs";
import { LayoutDashboard, ArrowLeftRight, Layers, TrendingUp, Star } from "lucide-react";

const FeatureCard = ({ title, description, icon, imgSrc, imgAlt }) => (
  <div
    style={{ backgroundColor: "#1D1F2E" }}
    className="w-full overflow-hidden h-full rounded-2xl px-8 pt-6 pb-4 text-white border border-white/20 text-center flex flex-col"
  >
    <div className="flex items-center justify-center gap-2.5 mb-1">
      <span className="text-green-400">{icon}</span>
      <p className="text-2xl md:text-3xl font-semibold font-['Bruno_Ace_SC']">{title}</p>
    </div>
    <p className="text-sm md:text-base font-normal text-neutral-400 mt-2 mb-4 max-w-lg mx-auto">
      {description}
    </p>
    <div className="flex-1 min-h-0">
      <img
        src={imgSrc}
        alt={imgAlt}
        className="w-full h-full object-cover object-top rounded-xl"
      />
    </div>
  </div>
);

export function LandingPageFeatureComponent() {
  const tabs = [
    {
      title: "Portfolio",
      value: "portfolio",
      content: (
        <FeatureCard
          title="Portfolio Overview"
          description="Track your total portfolio value, all-time profit/loss, and asset allocation at a glance. Live data, beautifully visualised."
          icon={<LayoutDashboard size={24} />}
          imgSrc="../src/assets/koinsight-portfolio-page.jpg"
          imgAlt="portfolio overview"
        />
      ),
    },
    {
      title: "Transactions",
      value: "transactions",
      content: (
        <FeatureCard
          title="Transaction Logging"
          description="Log every buy, sell, and transfer with full detail: price, quantity, fees, and notes. Your complete transaction history in one place."
          icon={<ArrowLeftRight size={24} />}
          imgSrc="../src/assets/koin-sight-transaction-tab.jpg"
          imgAlt="transaction logging"
        />
      ),
    },
    {
      title: "Asset Details",
      value: "asset-details",
      content: (
        <FeatureCard
          title="Asset Details"
          description="Drill into any holding. See your average buy price, cost basis, total P&L, and every transaction tied to that asset."
          icon={<Layers size={24} />}
          imgSrc="../src/assets/koin-sight-asset-detail-page.jpg"
          imgAlt="asset details"
        />
      ),
    },
    {
      title: "Market Insight",
      value: "market-insight",
      content: (
        <FeatureCard
          title="Market Insight"
          description="Browse live prices and market data for 250+ cryptocurrencies. Stay informed before you make your next move."
          icon={<TrendingUp size={24} />}
          imgSrc="../src/assets/koin-sight_detail-page.jpg"
          imgAlt="market insight"
        />
      ),
    },
    {
      title: "Watchlist",
      value: "watchlist",
      content: (
        <FeatureCard
          title="Watchlist"
          description="Keep tabs on coins you don't own yet. Monitor price movements and stay ready for your next entry."
          icon={<Star size={24} />}
          imgSrc="../src/assets/koin-sight_watchlist.jpg"
          imgAlt="watchlist"
        />
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-10">
      <Tabs tabs={tabs} />
    </div>
  );
}
