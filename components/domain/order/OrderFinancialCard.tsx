import { Order } from '../../../types/models'

export function OrderFinancialCard({ order }: { order: Order }) {
  return (
    <div className="rounded-lg bg-secondary p-6">
      <h3 className="mb-4 font-semibold">Financials</h3>

      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-400">Declared Value</p>
          <p className="font-bold">{order.declaredValue} EGP</p>
        </div>

        <div>
          <p className="text-gray-400">COD Amount</p>
          <p className="font-bold">{order.codAmount} EGP</p>
        </div>
      </div>
    </div>
  )
}