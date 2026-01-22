import { Order } from '../../../types/order';
import { Eye } from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  "In Transit": "bg-blue-500/20 text-blue-400",
  Delivered: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

export function OrderRow({ order }: { order: Order }) {
  return (
    <tr className="border-t border-primary/20 text-sm hover:bg-primary/40">
      <td className="px-4 py-3 font-medium">{order.id}</td>
      <td className="px-4 py-3">{order.merchantName}</td>
      <td className="px-4 py-3">{order.recipientName}</td>
      <td className="px-4 py-3">{order.codAmount}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            STATUS_STYLES[order.status]
          }`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-4 py-3">{order.date}</td>
      <td className="px-4 py-3">
        <Link
          href={`/admin/orders/${order.id.replace("#", "")}`}
          className="flex items-center gap-2 text-accent hover:underline"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
      </td>
    </tr>
  );
}