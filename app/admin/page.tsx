import { dashboardStats, ordersIntelligence, revenueIntelligence } from '../../lib/mock/dashboard'
import { mockOrders as ordersMock } from '../../lib/mock/orders'

import { StatCard } from '../../components/ui/StatCard'
import { OrderCard } from '../../components/domain/order/OrderCard'
import { IntelligenceCard } from '../../components/dashboard/IntelligenceCard'
import { Button } from '../../components/ui/Button'
import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">لوحة المعلومات</h1>
          <p className="mt-1 text-sm text-gray-400">
            Overview of platform performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Download Report</Button>
          <Button variant="primary" size="sm">Create Order</Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg bg-secondary p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/admin/orders">
            <Button variant="accent" size="sm">View All</Button>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {ordersMock.slice(0, 3).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>

      {/* Intelligence */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IntelligenceCard
          title="Orders Intelligence"
          items={[
            { label: 'Total Orders', value: ordersIntelligence.total.toString() },
            { label: 'Delivered', value: ordersIntelligence.deliveredRate, highlight: 'success' },
            { label: 'Cancelled', value: ordersIntelligence.cancelledRate, highlight: 'danger' },
            { label: 'Trend', value: ordersIntelligence.trend, highlight: 'accent' },
          ]}
        />

        <IntelligenceCard
          title="Revenue Intelligence"
          items={[
            { label: 'Total Revenue', value: revenueIntelligence.total },
            { label: 'Avg Order Value', value: revenueIntelligence.avgOrder },
            { label: 'Growth', value: revenueIntelligence.growth, highlight: 'accent' },
            { label: 'Vs Last Month', value: revenueIntelligence.comparedToLastMonth, highlight: 'success' },
          ]}
        />
      </div>
    </div>
  )
}