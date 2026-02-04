import { Order } from '../../../types/models'
import { Card } from '../../ui/Card'
import { OrderStatusBadge } from './OrderStatusBadge'

interface Props {
  order: Order
  role?: 'admin' | 'merchant' | 'courier'
}

export function OrderCard({ order, role = 'admin' }: Props) {
  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Tracking</p>
          <h3 className="font-semibold">{order.trackingNumber}</h3>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Recipient */}
      <div className="text-sm text-gray-300">
        <p>{order.recipientName}</p>
        <p className="text-xs">{order.recipientCity} – {order.recipientAddress}</p>
      </div>

      {/* Financial */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <div>
          <p className="text-xs text-gray-400">COD</p>
          <p className="font-bold">{order.codAmount} EGP</p>
        </div>

        {role !== 'courier' && (
          <button className="text-sm text-primary">
            View Details →
          </button>
        )}
      </div>
    </Card>
  )
}