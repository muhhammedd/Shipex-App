import { mockOrders } from "../../../../lib/mock/orders";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default function OrderDetailsPage({ params }: Props) {
  const order = mockOrders.find(o => o.trackingNumber === `SPX-${params.id}`);

  if (!order) {
    return <p className="text-white">Order not found</p>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-accent hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      {/* Order Header */}
      <div className="rounded-lg bg-secondary p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Order {order.trackingNumber}</h1>
        <p className="text-sm text-gray-400">{order.status.replace('_', ' ')}</p>
        <p className="mt-2 text-sm text-gray-300">Created At: {new Date(order.createdAt).toLocaleString()}</p>
        <p className="text-sm text-gray-300">Updated At: {new Date(order.updatedAt).toLocaleString()}</p>
      </div>

      {/* Recipient Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg bg-secondary p-4 text-white">
          <h2 className="font-semibold mb-2">Recipient Info</h2>
          <p><strong>Name:</strong> {order.recipientName}</p>
          <p><strong>Phone:</strong> {order.recipientPhone}</p>
          <p><strong>Address:</strong> {order.address}, {order.city}</p>
        </div>

        {/* Financial Info */}
        <div className="rounded-lg bg-secondary p-4 text-white">
          <h2 className="font-semibold mb-2">Financials</h2>
          <p><strong>Price:</strong> EGP {order.price}</p>
          <p><strong>COD Amount:</strong> EGP {order.codAmount}</p>
        </div>
      </div>

      {/* Order History */}
      <div className="rounded-lg bg-secondary p-4 text-white">
        <h2 className="font-semibold mb-4">Order History</h2>
        <ul className="space-y-3">
          {order.history.map((h) => (
            <li key={h.id} className="border-l-2 border-accent pl-3">
              <p className="text-sm">
                {h.statusFrom} → {h.statusTo}{" "}
                {h.location ? `@ ${h.location}` : ""}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(h.timestamp).toLocaleString()} by {h.changedBy.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}