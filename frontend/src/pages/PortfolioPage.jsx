import React from "react";
import { AssetsTable } from "../components/AssetsTable.jsx";
import { TransactionTable } from "../components/TransactionTable.jsx";

import { Card, Tabs, Button } from "flowbite-react";
1;
export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm text-blue-400 mb-2">test</div>
            <div className="text-4xl font-bold mb-2">$67.12</div>
            <div className="text-red-500">-$2.5476 ▼ 3.66% (24h)</div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-blue-600">+ Add Transaction</Button>
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
          <p className="text-2xl font-bold text-red-500">-$2.2634</p>
          <p className="text-red-500 text-sm">▼ 2.94%</p>
        </Card>

        <Card className="bg-gray-800">
          <h4 className="text-gray-400 text-sm mb-2">Cost Basis</h4>
          <p className="text-2xl font-bold">$77.10</p>
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
          <AssetsTable />
        </Tabs.Item>
        <Tabs.Item title="Transactions">
          <TransactionTable />
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
