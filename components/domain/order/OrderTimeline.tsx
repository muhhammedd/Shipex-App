import { OrderHistory } from '../../../types/order'
import { OrderStatusBadge } from './OrderStatusBadge'

export function OrderTimeline({ history }: { history: OrderHistory[] }) {
  return (
    <div className="rounded-lg bg-secondary p-6">
      <h3 className="mb-4 font-semibold">Order History</h3>

      <div className="space-y-5">
        {history.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="mt-2 h-2 w-2 rounded-full bg-accent" />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <OrderStatusBadge status={item.statusTo} />
                <span className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-gray-300">
                Changed by <strong>{item.changedBy.name}</strong>
                {item.location && ` • ${item.location}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}