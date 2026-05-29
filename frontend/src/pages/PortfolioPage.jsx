import React, { useEffect, useState } from "react";
import { AssetsTable } from "../components/AssetsTable.jsx";
import { TransactionTable } from "../components/TransactionTable.jsx";
import SelectCoinModal from "./addTransactionButton/SelectCoinModal.jsx";
import { Tabs, Button, ButtonGroup } from "flowbite-react";
import AddTransactionModal from "./addTransactionButton/AddTransactionModal.jsx";
import { getMyPortfolio } from "../services/assetApi.js";

import DecryptedText from "../components/DecryptedText.jsx";

//{user} prop is passed down from App.jsx to render username and conditionally show portfolio data
export default function PortfolioPage({ user }) {
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [chartType, setChartType] = useState("line");
  const [transactionRefreshKey, setTransactionRefreshKey] = useState(0);
  const [assetRefreshKey, setAssetRefreshKey] = useState(0);
  const [portfolioRefreshKey, setPortfolioRefreshKey] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const [asset, setAsset] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!portfolio) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No portfolio yet</p>
        <p className="text-sm">
          Add a transaction to start tracking your portfolio
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

  return (
    <div className="min-h-screen text-white p-6 pt-24">
      {/* Header */}

      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            {user && (
              <div className="text-2xl text-gray-400 mb-2">
                {user.username}'s Portfolio
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
              {portfolio.totalPriceChange24hPercent.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              (24h)
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCoinModal(true)}
              className="bg-blue-600"
            >
              + Add Transaction
            </Button>
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
                setShowTransactionModal={setShowTransactionModal}
                onSuccess={() => {
                  setTransactionRefreshKey((currentKey) => currentKey + 1);
                  setAssetRefreshKey((currentKey) => currentKey + 1);
                  setPortfolioRefreshKey((currentKey) => currentKey + 1);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="mb-8">
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Holdings</h3>
            <ButtonGroup>
              <Button
                size="sm"
                color={chartType === "line" ? "blue" : "gray"}
                onClick={() => setChartType("line")}
              >
                Line
              </Button>
              <Button
                size="sm"
                color={chartType === "pie" ? "blue" : "gray"}
                onClick={() => setChartType("pie")}
              >
                Pie
              </Button>
            </ButtonGroup>
          </div>

          {/* Chart placeholder — swap with your chart component */}
          <div className="h-64 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 text-sm">
            {chartType === "line" ? "Line chart coming soon" : "Pie chart coming soon"}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
          <h4 className="text-gray-400 text-sm mb-2">All-time profit</h4>
          <p
            className={`${portfolioConfig[status_allTime]?.color} text-2xl mb-2 font-semibold`}
          >
            {portfolio.allTimeProfitLoss.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p
            className={`${portfolioConfig[status_allTime]?.color} text-sm font-semibold`}
          >
            {portfolioConfig[status_allTime]?.icon}{" "}
            {portfolio.allTimeProfitLossPercent.toFixed(3)}%
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
          <h4 className="text-gray-400 text-sm mb-2">Cost Basis</h4>
          <p className="text-2xl font-bold">
            {portfolio.totalPortfolioCost.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-gray-400 text-sm mb-2">Best Performer</h4>
              <div className="flex flex-row gap-3">
                <img
                  src={bestPerformer.image}
                  alt={bestPerformer.name}
                  style={{ width: "24px", height: "24px" }}
                />{" "}
                <p className="text-lg font-bold mb-2">
                  {bestPerformer.symbol?.toUpperCase()}
                </p>
              </div>
              <p className={`${portfolioConfig[status_profitLossBest]?.color}`}>
                {bestPerformer.profitLoss?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {portfolioConfig[status_profitLossBest]?.sign}{" "}
                {bestPerformer.profitLoss_percentage?.toFixed(2)}%
              </p>
            </div>
            <div>
              <h4 className="text-gray-400 text-sm mb-2">Worst Performer</h4>
              <div className="flex flex-row gap-3 mb-2">
                <img
                  src={worstPerformer.image}
                  alt={worstPerformer.name}
                  style={{ width: "24px", height: "24px" }}
                />
                <p className="text-lg font-bold">
                  {worstPerformer.symbol?.toUpperCase()}
                </p>
              </div>
              <p
                className={`${portfolioConfig[status_profitLossWorst]?.color}`}
              >
                {worstPerformer.profitLoss?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {portfolioConfig[status_profitLossWorst]?.sign}{" "}
                {worstPerformer.profitLoss_percentage?.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Table */}
      <Tabs>
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
          />
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
