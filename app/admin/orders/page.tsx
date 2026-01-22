import { OrderFilters } from "../../../components/domain/order/OrderFilters";
import { OrderRow } from "../../../components/domain/order/OrderRow";
import { mockOrders } from "../../../lib/mock/orders";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all orders</p>
        </div>

        <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary hover:opacity-90">
          Export
        </button>
      </div>

      {/* Filters */}
      <OrderFilters />

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg bg-secondary text-white">
        <table className="w-full border-collapse">
          <thead className="bg-primary/60 text-sm text-gray-300">
            <tr>
              <th className="px-4 py-3 text-right">Order ID</th>
              <th className="px-4 py-3 text-right">Merchant</th>
              <th className="px-4 py-3 text-right">Recipient</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3 text-right">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {mockOrders.map((order) => (
              <OrderRow key={order.id} order={{
                id: order.trackingNumber,
                merchantName: order.merchantName,
                recipientName: order.recipientName,
                amount : order.amount,
                status: order.status,
                createdAt: new Date(order.createdAt).toISOString().split('T')[0]
              }} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}