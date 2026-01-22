import { Order } from '../../../types/order'

export function OrderRecipientCard({ order }: { order: Order }) {
  return (
    <div className="rounded-lg bg-secondary p-6">
      <h3 className="mb-4 font-semibold">Recipient Details</h3>

      <div className="space-y-2 text-sm text-gray-300">
        <p><strong>Name:</strong> {order.recipientName}</p>
        <p><strong>Phone:</strong> {order.recipientPhone}</p>
        <p>
          <strong>Address:</strong> {order.city} – {order.address}
        </p>
      </div>
    </div>
  )
}