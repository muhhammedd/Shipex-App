import { OrderStatus } from '../../../types/order';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderRowProps {
  order: {
    id: string;
    merchantName: string;
    recipientName: string;
    amount: string;
    status: OrderStatus;
    createdAt: string;
  }
}

export function OrderRow({ order }: OrderRowProps) {
  return (
    <tr className="border-t border-primary/20 text-sm hover:bg-primary/40">
      <td className="px-4 py-3 font-medium">{order.id}</td>
      <td className="px-4 py-3">{order.merchantName}</td>
      <td className="px-4 py-3">{order.recipientName}</td>
      <td className="px-4 py-3">{order.amount}</td>
      <td className="px-4 py-3">
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="px-4 py-3">{order.createdAt}</td>
      <td className="px-4 py-3">
        <Link
          href={`/admin/orders/${order.id.replace("SPX-", "")}`}
          className="flex items-center gap-2 text-accent hover:underline"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
      </td>
    </tr>
  );
}