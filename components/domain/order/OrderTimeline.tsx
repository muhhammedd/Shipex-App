import { OrderHistory } from '../../../types/models'
import { OrderStatusBadge } from './OrderStatusBadge'

export function OrderTimeline({ history }: { history: OrderHistory[] }) {
  return (
    <div className="rounded-lg bg-secondary p-6 text-white">
      <h3 className="mb-6 text-lg font-semibold border-b border-primary/20 pb-2">Order History</h3>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-1 before:h-full before:w-0.5 before:bg-primary/20">
        {history.map((item, index) => (
          <div key={item.id} className="relative flex items-start gap-6">
            <div className={`absolute -left-0.5 mt-1.5 h-3 w-3 rounded-full border-2 border-secondary ${index === 0 ? 'bg-accent scale-125' : 'bg-gray-500'
              }`} />

            <div className="flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={item.statusTo} />
                  {index === 0 && (
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent uppercase">
                      Latest
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="mt-2 rounded-md bg-primary/20 p-3">
                <p className="text-sm text-gray-300">
                  Status changed from <span className="text-gray-400 italic">{item.statusFrom}</span> to <span className="text-white font-medium">{item.statusTo}</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  By <strong>{item.changedBy.name}</strong>
                  {item.location && ` • Location: ${item.location}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}