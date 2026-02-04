import { Badge } from '../../ui/Badge'
import { OrderStatus } from '../../../types/models'

const map: Record<OrderStatus, { label: string; variant: any }> = {
  CREATED: { label: 'Created', variant: 'info' },
  PENDING: { label: 'Pending', variant: 'info' },
  ASSIGNED: { label: 'Assigned', variant: 'info' },
  PICKED_UP: { label: 'Picked Up', variant: 'warning' },
  IN_TRANSIT: { label: 'In Transit', variant: 'warning' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', variant: 'info' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'error' },
  RETURNED: { label: 'Returned', variant: 'error' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = map[status] || { label: status, variant: 'info' }
  return <Badge label={config.label} variant={config.variant} />
}