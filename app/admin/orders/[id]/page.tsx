import { mockOrders } from "../../../../lib/mock/orders";
import { ArrowLeft, UserPlus, FileText } from "lucide-react";
import Link from "next/link";
import { OrderTimeline } from "../../../../components/domain/order/OrderTimeline";
import { OrderStatusBadge } from "../../../../components/domain/order/OrderStatusBadge";

interface Props {
  params: { id: string };
}

export default function OrderDetailsPage({ params }: Props) {
  const order = mockOrders.find(o => o.trackingNumber === `SPX-${params.id}`);

  if (!order) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-white">
        <p className="text-xl font-semibold">Order not found</p>
        <Link href="/admin/orders" className="mt-4 text-accent hover:underline">
          Return to orders list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-accent hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/80">
            <UserPlus className="h-4 w-4" /> Assign Courier
          </button>
          <button className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary hover:opacity-90">
            <FileText className="h-4 w-4" /> Update Status
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-secondary p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order {order.trackingNumber}</h1>
            <div className="mt-2">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <div className="text-left text-sm text-gray-400">
            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg bg-secondary p-6 text-white">
              <h2 className="text-lg font-semibold mb-4 border-b border-primary/20 pb-2">Recipient Info</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block">Name</label>
                  <p className="font-medium">{order.recipientName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block">Phone</label>
                  <p className="font-medium">{order.recipientPhone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block">Address</label>
                  <p className="font-medium">{order.address}, {order.city}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-secondary p-6 text-white">
              <h2 className="text-lg font-semibold mb-4 border-b border-primary/20 pb-2">Financials</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block">Base Price</label>
                  <p className="font-medium">EGP {order.price}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block">COD Amount</label>
                  <p className="font-medium text-accent">EGP {order.codAmount}</p>
                </div>
                <div className="pt-2">
                  <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] text-accent font-semibold uppercase">
                    Paid via Cash
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <OrderTimeline history={order.history} />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-secondary p-6 text-white">
            <h2 className="text-lg font-semibold mb-4 border-b border-primary/20 pb-2">Merchant Info</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block">Merchant Name</label>
                <p className="font-medium">{order.merchantName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block">Merchant ID</label>
                <p className="font-medium text-gray-400">{order.merchantId}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-secondary p-6 text-white">
            <h2 className="text-lg font-semibold mb-4 border-b border-primary/20 pb-2">Shipping Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block">Courier</label>
                <p className="font-medium">{order.courierId || 'Not assigned'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block">City</label>
                <p className="font-medium">{order.city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
