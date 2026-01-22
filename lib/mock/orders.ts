import { Order } from '../../types/order'

export const mockOrders: Order[] = [
  {
    id: '1',
    trackingNumber: 'SPX-100245',
    status: 'DELIVERED',

    tenantId: 'tenant-1',
    merchantId: 'merchant-1',
    merchantName: 'Tech Store',
    courierId: 'courier-1',

    recipientName: 'Ahmed Ali',
    recipientPhone: '01012345678',
    address: 'Nasr City, Abbas El Akkad',
    city: 'Cairo',

    price: 420,
    amount: '420 EGP',
    codAmount: 420,

    createdAt: '2026-01-18T08:30:00Z',
    updatedAt: '2026-01-18T12:00:00Z',

    history: [
      {
        id: 'h1',
        statusFrom: 'CREATED',
        statusTo: 'PICKED_UP',
        location: 'Warehouse',
        timestamp: '2026-01-18T09:00:00Z',
        changedBy: { id: 'u1', name: 'Admin' },
      },
      {
        id: 'h2',
        statusFrom: 'PICKED_UP',
        statusTo: 'DELIVERED',
        location: 'Customer Address',
        timestamp: '2026-01-18T11:30:00Z',
        changedBy: { id: 'u2', name: 'Courier' },
      },
    ],
  },
  {
    id: '2',
    trackingNumber: 'SPX-100246',
    status: 'IN_TRANSIT',

    tenantId: 'tenant-1',
    merchantId: 'merchant-2',
    merchantName: 'Fashion Hub',
    courierId: 'courier-2',

    recipientName: 'Mohamed Samy',
    recipientPhone: '01023456789',
    address: 'Heliopolis, El Merghany St.',
    city: 'Cairo',

    price: 860,
    amount: '860 EGP',
    codAmount: 860,

    createdAt: '2026-01-18T09:00:00Z',
    updatedAt: '2026-01-18T12:45:00Z',

    history: [
      {
        id: 'h3',
        statusFrom: 'CREATED',
        statusTo: 'ASSIGNED',
        timestamp: '2026-01-18T09:15:00Z',
        changedBy: { id: 'u1', name: 'Admin' },
      },
    ],
  },
  {
    id: '3',
    trackingNumber: 'SPX-100247',
    status: 'CANCELLED',

    tenantId: 'tenant-1',
    merchantId: 'merchant-2',
    merchantName: 'Fashion Hub',
    courierId: 'null',

    recipientName: 'Mohamed Eid',
    recipientPhone: '01034567890',
    address: 'Maadi, Road 9',
    city: 'Cairo',

    price: 860,
    amount: '860 EGP',
    codAmount: 860,

    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-18T11:00:00Z',

    history: [
      {
        id: 'h4',
        statusFrom: 'CREATED',
        statusTo: 'CANCELLED',
        timestamp: '2026-01-18T10:30:00Z',
        changedBy: { id: 'u1', name: 'Admin' },
      },
    ],
  },
  {
    id: '4',
    trackingNumber: 'SPX-100248',
    status: 'DELIVERED',

    tenantId: 'tenant-1',
    merchantId: 'merchant-3',
    merchantName: 'Mobile Shop',
    courierId: 'courier-3',

    recipientName: 'Omar Hassan',
    recipientPhone: '01045678901',
    address: '6th of October, Nile St.',
    city: 'Giza',

    price: 640,
    amount: '640 Egp',
    codAmount: 640,

    createdAt: '2026-01-17T14:30:00Z',
    updatedAt: '2026-01-17T16:00:00Z',

    history: [
      {
        id: 'h5',
        statusFrom: 'CREATED',
        statusTo: 'PICKED_UP',
        location: 'Warehouse',
        timestamp: '2026-01-17T15:00:00Z',
        changedBy: { id: 'u1', name: 'Admin' },
      },
      {
        id: 'h6',
        statusFrom: 'PICKED_UP',
        statusTo: 'DELIVERED',
        location: 'Customer Address',
        timestamp: '2026-01-17T15:45:00Z',
        changedBy: { id: 'u3', name: 'Courier' },
      },
    ],
  },
  {
    id: '5',
    trackingNumber: 'SPX-100249',
    status: 'PICKED_UP',

    tenantId: 'tenant-1',
    merchantId: 'merchant-4',
    merchantName: 'Gadget World',
    courierId: "لا يوجد",

    recipientName: 'Sara Ibrahim',
    recipientPhone: '01056789012',
    address: 'Alexandria, Corniche St.',
    city: 'Alexandria',

    price: 1200,
    amount: '1200 EGP',
    codAmount: 1200,

    createdAt: '2026-01-17T09:00:00Z',
    updatedAt: '2026-01-17T09:30:00Z',

    history: [
      {
        id: 'h7',
        statusFrom: 'CREATED',
        statusTo: 'PICKED_UP',
        timestamp: '2026-01-17T09:10:00Z',
        changedBy: { id: 'u1', name: 'Admin' },
      },
    ],
  },
]