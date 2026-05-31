import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const TAILWIND_COLORS = [
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#a855f7", // purple-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
];

export function PortfolioCharts({ chart, allocationData }) {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-6 mb-8">
      {/* Line Chart */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Portfolio Value
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chart}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="timestamp"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 11 }}
              interval={Math.ceil(chart.length / 6)}
              tickFormatter={(tick) =>
                new Date(tick).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 11 }}
              tickCount={4}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              padding={{ top: 0, bottom: 30 }}
              domain={[
                (dataMin) => Math.floor(dataMin * 0.99),
                (dataMax) => Math.ceil(dataMax * 1.01),
              ]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2E303D",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              formatter={(value) => `$${value.toFixed(2)}`}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke="#06DF73"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Allocation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="percent"
              nameKey="_id"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={TAILWIND_COLORS[index % TAILWIND_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
