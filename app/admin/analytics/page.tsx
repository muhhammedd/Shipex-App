"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const stats = [
  { label: "Total Orders", value: "12,480" },
  { label: "Delivered Orders", value: "10,930" },
  { label: "Active Drivers", value: "86" },
  { label: "Total Revenue", value: "EGP 420K" },
];

const chartData = [
  { name: "Jan", orders: 820, revenue: 32000 },
  { name: "Feb", orders: 940, revenue: 37000 },
  { name: "Mar", orders: 1100, revenue: 42000 },
  { name: "Apr", orders: 980, revenue: 39000 },
  { name: "May", orders: 1250, revenue: 48000 },
  { name: "Jun", orders: 1400, revenue: 55000 },
];

const topZones = [
  { name: "Cairo", orders: 5200, revenue: "EGP 180K" },
  { name: "Giza", orders: 3900, revenue: "EGP 130K" },
  { name: "Alexandria", orders: 2400, revenue: "EGP 90K" },
];

const topMerchants = [
  { name: "Fashion Store", orders: 2100, revenue: "EGP 75K" },
  { name: "Electro Shop", orders: 1800, revenue: "EGP 62K" },
  { name: "Beauty Hub", orders: 1500, revenue: "EGP 48K" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Business performance overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-lg bg-secondary p-5 text-white"
          >
            <p className="text-sm text-gray-400">{item.label}</p>
            <p className="mt-2 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orders Chart */}
        <div className="rounded-lg bg-secondary p-5 text-white">
          <h3 className="mb-4 font-semibold">Orders Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#FFCB74"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-lg bg-secondary p-5 text-white">
          <h3 className="mb-4 font-semibold">Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#FFCB74" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Performance Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Zones */}
        <div className="rounded-lg bg-secondary p-5 text-white">
          <h3 className="mb-4 font-semibold">Top Zones</h3>

          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="pb-2 text-right">Zone</th>
                <th className="pb-2 text-right">Orders</th>
                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topZones.map((zone) => (
                <tr
                  key={zone.name}
                  className="border-t border-primary/20 hover:bg-primary/40"
                >
                  <td className="py-3 font-medium">{zone.name}</td>
                  <td className="py-3">{zone.orders}</td>
                  <td className="py-3">{zone.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Merchants */}
        <div className="rounded-lg bg-secondary p-5 text-white">
          <h3 className="mb-4 font-semibold">Top Merchants</h3>

          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="pb-2 text-right">Merchant</th>
                <th className="pb-2 text-right">Orders</th>
                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topMerchants.map((merchant) => (
                <tr
                  key={merchant.name}
                  className="border-t border-primary/20 hover:bg-primary/40"
                >
                  <td className="py-3 font-medium">{merchant.name}</td>
                  <td className="py-3">{merchant.orders}</td>
                  <td className="py-3">{merchant.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}