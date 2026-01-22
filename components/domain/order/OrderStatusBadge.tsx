import { Badge } from '../../ui/Badge'
import { OrderStatus } from '../../../types/order'

const map: Record<OrderStatus, { label: string; variant: any }> = {
  CREATED: { label: 'Created', variant: 'info' },
  ASSIGNED: { label: 'Assigned', variant: 'info' },
  PICKED_UP: { label: 'Picked Up', variant: 'warning' },
  IN_TRANSIT: { label: 'In Transit', variant: 'warning' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'error' },
  FAILED: { label: 'Failed', variant: 'error' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = map[status]
  return <Badge label={config.label} variant={config.variant} />
}