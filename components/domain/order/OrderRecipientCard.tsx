import { Order } from '../../../types/models'

export function OrderRecipientCard({ order }: { order: Order }) {
  return (
    <div className="rounded-lg bg-secondary p-6">
      <h3 className="mb-4 font-semibold">Recipient Details</h3>

      <div className="space-y-2 text-sm text-gray-300">
        <p className="font-bold">{order.recipientName}</p>
        <p className="text-sm">{order.recipientPhone}</p>
      </div>

      <div className="space-y-1 pt-3">
        <p className="text-xs text-gray-400">Address Node</p>
        <p className="text-sm leading-relaxed">{order.recipientCity} – {order.recipientAddress}</p>
      </div>
    </div>
  )
}