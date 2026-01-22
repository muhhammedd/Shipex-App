export type OrderStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED'

export interface OrderHistory {
  id: string
  statusFrom: OrderStatus
  statusTo: OrderStatus
  location?: string
  timestamp: string
  changedBy: {
    id: string
    name: string
  }
}

export interface Order {
  id: string
  trackingNumber: string
  status: OrderStatus

  tenantId: string
  merchantId: string
  merchantName: string
  courierId?: string

  recipientName: string
  recipientPhone: string
  address: string
  city: string

  price: number
  amount: string
  codAmount: number

  createdAt: string
  updatedAt: string

  history: OrderHistory[]
}