import React, { useEffect, useState } from "react";
import { AssetsTable } from "../components/portfolioPage/AssetsTable.jsx";
import { TransactionTable } from "../components/portfolioPage/TransactionTable.jsx";
import { Tabs } from "flowbite-react";
import { getMyChart, getMyPortfolio } from "../services/assetApi.js";
import { PortfolioCharts } from "../components/portfolioPage/PortfolioCharts.jsx";
import { PortfolioStatsCards } from "../components/portfolioPage/PortfolioStatsCards.jsx";
import SelectCoinModal from "../components/portfolioPage/SelectCoinModal.jsx";
import AddTransactionModal from "../components/portfolioPage/AddTransactionModal.jsx";
import DeleteTransactionModal from "../components/portfolioPage/DeleteTransactionModal.jsx";
import DecryptedText from "../components/ui/DecryptedText.jsx";

//{user} prop is passed down from App.jsx to render username and conditionally show portfolio data
export default function PortfolioPage({ user }) {
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionRefreshKey, setTransactionRefreshKey] = useState(0);
  const [assetRefreshKey, setAssetRefreshKey] = useState(0);
  const [portfolioRefreshKey, setPortfolioRefreshKey] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chart, setChart] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const [asset, setAsset] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // get Portfolio
  useEffect(() => {
    if (!user) {
      return;
    }

    const getPortfolio = async () => {
      try {
        const data = await getMyPortfolio();
        console.log("Portfolio data:", data);
        setPortfolio(data.data);
      } catch (err) {
        setError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };
    getPortfolio();
  }, [portfolioRefreshKey]);

  // draw chart
  useEffect(() => {
    if (!user) {
      return;
    }

    const getChart = async () => {
      try {
        const data = await getMyChart();
        console.log("Chart data:", data);
        setChart(data.data);
      } catch (err) {
        setError("Failed to load chart");
      } finally {
        setLoading(false);
      }
    };
    // initial draw
    getChart();
    // while chart is up, redraw every 5 * 60 * 1000
    const interval = setInterval(() => {
      console.log("Auto-refreshing portfolio chart data...");
      getChart();
    }, 300000);
    // if user switch chart, clear interval
    return () => clearInterval(interval);
  }, [user, transactionRefreshKey]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!portfolio) {
    return (
      <div className="text-center py-12 text-gray-400">
        <br />
        <br />
        <br />
        <p className="text-lg mb-2">No portfolio yet</p>
        <p className="text-sm">
          Please kindly register or log in to use the portfolio tracker.
        </p>
      </div>
    );
  }
  const sortAsset = [...asset].sort((a, b) => {
    const pctA = Number(a.profitLoss_percentage) || 0;
    const pctB = Number(b.profitLoss_percentage) || 0;

    return pctB - pctA;
  });
  const bestPerformer = sortAsset[0] ?? [];
  const worstPerformer = sortAsset.at(-1) ?? [];
  const allocationData = portfolio.allocation ?? [];

  const portfolioConfig = {
    positive: {
      color: "text-green-400",
      icon: "▲",
      sign: "+",
    },
    negative: {
      color: "text-red-400",
      icon: "▼",
      sign: "-",
    },
    neutral: {
      color: "text-grey-400",
      icon: "-",
      sign: " ",
    },
  };
  const status_priceChange24h = !portfolio.totalPriceChange24h
    ? "neutral"
    : portfolio.totalPriceChange24h > 0
      ? "positive"
      : "negative";
  const status_allTime = !portfolio.allTimeProfitLoss
    ? "neutral"
    : portfolio.allTimeProfitLoss > 0
      ? "positive"
      : "negative";
  const status_profitLossBest = !bestPerformer.profitLoss_percentage
    ? "neutral"
    : bestPerformer.profitLoss_percentage > 0
      ? "positive"
      : "negative";
  const status_profitLossWorst = !worstPerformer.profitLoss_percentage
    ? "neutral"
    : worstPerformer.profitLoss_percentage > 0
      ? "positive"
      : "negative";

  const handleSuccess = () => {
    setTransactionRefreshKey((k) => k + 1);
    setAssetRefreshKey((k) => k + 1);
    setPortfolioRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen text-white p-6 pt-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            {user && (
              <div className="text-2xl text-gray-400 mb-2">
                {user.username}'s Portfolio:
              </div>
            )}
            <div style={{ marginTop: "1rem" }}>
              <div className="text-4xl text-white mb-2">
                <DecryptedText
                  text={portfolio.totalPortfolioValue.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  revealDirection="start"
                  sequential
                  useOriginalCharsOnly={false}
                  animateOn="view"
                  speed={80}
                />
              </div>
            </div>
            <div
              className={`${portfolioConfig[status_priceChange24h]?.color} font-semibold text-sm flex items-center gap-1`}
            >
              {portfolio.totalPriceChange24h.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {portfolioConfig[status_priceChange24h]?.icon}{" "}
              {portfolio.totalPriceChange24hPercent?.toFixed(2)}% (24h)
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingTransaction(null);
                setSelectedCoin(null);
                setShowCoinModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition cursor-pointer"
            >
              + Add Transaction
            </button>

            {showCoinModal && (
              <SelectCoinModal
                setShowCoinModal={setShowCoinModal}
                setSelectedCoin={setSelectedCoin}
                setShowTransactionModal={setShowTransactionModal}
              />
            )}

            {showTransactionModal && (
              <AddTransactionModal
                selectedCoin={selectedCoin}
                editingTransaction={editingTransaction}
                setShowTransactionModal={setShowTransactionModal}
                setEditingTransaction={setEditingTransaction}
                onSuccess={handleSuccess}
              />
            )}

            {showDeleteModal && (
              <DeleteTransactionModal
                deletingTransaction={deletingTransaction}
                setShowDeleteModal={setShowDeleteModal}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <PortfolioCharts chart={chart} allocationData={allocationData} />

      {/* Stats Cards */}
      <PortfolioStatsCards
        portfolio={portfolio}
        portfolioConfig={portfolioConfig}
        status_allTime={status_allTime}
        bestPerformer={bestPerformer}
        worstPerformer={worstPerformer}
        status_profitLossBest={status_profitLossBest}
        status_profitLossWorst={status_profitLossWorst}
      />

      {/* Tabs & Table */}
      <Tabs
        theme={{
          tablist: {
            tabitem: {
              styles: {
                default: {
                  active: {
                    on: "bg-gray-100 text-white dark:bg-gray-800 dark:text-white",
                    off: "text-gray-400 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-300",
                  },
                },
              },
            },
          },
        }}
      >
        <Tabs.Item title="Assets" active>
          <AssetsTable
            user={user}
            refreshTrigger={assetRefreshKey}
            getAssetToPortfolio={setAsset}
          />
        </Tabs.Item>
        <Tabs.Item title="Transactions">
          <TransactionTable
            user={user}
            refreshTrigger={transactionRefreshKey}
            setEditingTransaction={setEditingTransaction}
            setShowTransactionModal={setShowTransactionModal}
            setDeletingTransaction={setDeletingTransaction}
            setShowDeleteModal={setShowDeleteModal}
          />
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
