import { Tabs } from "./ui/tabs";

export function LandingPageFeatureComponent() {
  const tabs = [
    {
      title: "Portfolio",
      value: "portfolio",
      content: (
        <div style={{ backgroundColor: "#1D1F2E" }} className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white border border-white/20 text-center">
          <p>Portfolio Overview</p>
          <img
            src="../src/assets/koin-sight_detail-page.jpg"
            alt="portfolio overview"
            className="object-cover object-top absolute bottom-4 inset-x-0 w-[80%] h-[80%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Transactions",
      value: "transactions",
      content: (
        <div style={{ backgroundColor: "#1D1F2E" }} className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white border border-white/20 text-center">
          <p>Transaction Logging</p>
          <img
            src="../src/assets/koin-sight_detail-page.jpg"
            alt="portfolio overview"
            className="object-cover object-top absolute bottom-4 inset-x-0 w-[80%] h-[80%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Asset Details",
      value: "asset-details",
      content: (
        <div style={{ backgroundColor: "#1D1F2E" }} className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white border border-white/20 text-center">
          <p>Asset Details</p>
          <img
            src="../src/assets/koin-sight_detail-page.jpg"
            alt="portfolio overview"
            className="object-cover object-top absolute bottom-4 inset-x-0 w-[80%] h-[80%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Marketplace",
      value: "marketplace",
      content: (
        <div style={{ backgroundColor: "#1D1F2E" }} className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white border border-white/20 text-center">
          <p>Marketplace</p>
          <img
            src="../src/assets/koin-sight_detail-page.jpg"
            alt="marketplace"
            className="object-cover object-top absolute bottom-4 inset-x-0 w-[80%] h-[80%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Watchlist",
      value: "watchlist",
      content: (
        <div style={{ backgroundColor: "#1D1F2E" }} className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white border border-white/20 text-center">
          <p>Watchlist</p>
          <img
            src="../src/assets/koin-sight_detail-page.jpg"
            alt="watchlist"
            className="object-cover object-top absolute bottom-4 inset-x-0 w-[80%] h-[80%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-10">
      <Tabs tabs={tabs} />
    </div>
  );
}
