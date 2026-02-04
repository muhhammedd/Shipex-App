import { OrderStatus } from '../../../types/models'

export function OrderActions({
  currentStatus,
}: {
  currentStatus: OrderStatus
}) {
  return (
    <div className="rounded-lg bg-secondary p-6">
      <h3 className="mb-4 font-semibold">Actions</h3>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary">
          Assign Courier
        </button>

        <button className="rounded-md bg-primary/40 px-4 py-2 text-sm">
          Change Status
        </button>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Actions will be enabled based on role & order status
      </p>
    </div>
  )
}