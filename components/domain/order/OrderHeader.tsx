import { Order } from '../../../types/order'
import { OrderStatusBadge } from './OrderStatusBadge'

export function OrderHeader({ order }: { order: Order }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400">Tracking Number</p>
        <h1 className="text-2xl font-bold">{order.trackingNumber}</h1>
      </div>
      <OrderStatusBadge status={order.status} />
    </div>
  )
}