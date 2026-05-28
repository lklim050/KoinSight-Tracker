import React, { useEffect, useState } from "react";
import { AssetsTable } from "../components/AssetsTable.jsx";
import { TransactionTable } from "../components/TransactionTable.jsx";
import SelectCoinModal from "./addTransactionButton/SelectCoinModal.jsx";

import { Card, Tabs, Button } from "flowbite-react";
import AddTransactionModal from "./addTransactionButton/AddTransactionModal.jsx";
import { getMyPortfolio } from "../services/assetApi.js";

//{user} prop is passed down from App.jsx to render username and conditionally show portfolio data
export default function PortfolioPage({ user }) {
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionRefreshKey, setTransactionRefreshKey] = useState(0);
  const [assetRefreshKey, setAssetRefreshKey] = useState(0);
  const [portfolioRefreshKey, setPortfolioRefreshKey] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const [portfolio, setPortfolio] = useState([]);
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

  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No portfolio yet</p>
        <p className="text-sm">
          Add a transaction to start tracking your portfolio
        </p>
      </div>
    );
  }

  const portfolioConfig = {
    positive: {
      color: "text-green-600",
      icon: "▲",
      sign: "+",
    },
    negative: {
      color: "text-red-600",
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

  portfolio.allTimeProfitLoss;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-24">
      {/* Header */}

      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            {user && (
              <div className="text-4xl text-white-400 mb-8">
                {user.username}'s Portfolio
              </div>
            )}
            <div className="text-4xl font-bold mb-2">
              {portfolio.totalPortfolioValue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div
              className={`${portfolioConfig[status_priceChange24h]?.color} font-semibold`}
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
      <div className="gap-6 mb-8">
        {/* Holdings Chart */}
        <Card className="bg-gray-800">
          <h3 className="text-xl font-semibold mb-4">Holdings</h3>
          {/* Your chart component here */}
          <div className="h-64 bg-gray-700 rounded">Chart placeholder</div>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-800">
          <h4 className="text-gray-400 text-sm mb-2">All-time profit</h4>
          <p
            className={`${portfolioConfig[status_allTime]?.color} text-4xl font-semibold`}
          >
            {portfolio.allTimeProfitLoss.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p
            className={`${portfolioConfig[status_allTime]?.color} text-2xl font-semibold`}
          >
            {portfolioConfig[status_allTime]?.icon}{" "}
            {portfolio.allTimeProfitLossPercent.toFixed(3)}%
          </p>
        </Card>

        <Card className="bg-gray-800">
          <h4 className="text-gray-400 text-sm mb-2">Cost Basis</h4>
          <p className="text-3xl font-bold">
            {portfolio.totalPortfolioCost.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </Card>

        <Card className="bg-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-gray-400 text-sm mb-2">Best Performer</h4>
              <p className="text-lg font-bold">BTC</p>
              <p className="text-red-500 text-sm">-$2.2634 ▼ 2.94%</p>
            </div>
            <div>
              <h4 className="text-gray-400 text-sm mb-2">Worst Performer</h4>
              <p className="text-lg font-bold">BTC</p>
              <p className="text-red-500 text-sm">-$2.2634 ▼ 2.94%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Table */}
      <Tabs>
        <Tabs.Item title="Assets" active>
          <AssetsTable user={user} refreshTrigger={assetRefreshKey} />
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
