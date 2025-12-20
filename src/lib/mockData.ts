import { User, Order, Role, OrderStatus } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alice Merchant',
    email: 'alice@shipex.com',
    role: 'merchant',
    isAuthenticated: false,
  },
  {
    id: 'user-2',
    name: 'Bob Courier',
    email: 'bob@shipex.com',
    role: 'courier',
    isAuthenticated: false,
  },
  {
    id: 'user-3',
    name: 'Charlie Admin',
    email: 'charlie@shipex.com',
    role: 'admin',
    isAuthenticated: false,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-1',
    merchantId: 'user-1',
    courierId: 'user-2',
    pickupAddress: '123 Merchant St, City A',
    deliveryAddress: '456 Customer Ave, City B',
    recipientName: 'Customer One',
    phone: '555-1234',
    price: 50.00,
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: 'order-2',
    merchantId: 'user-1',
    courierId: 'user-2',
    pickupAddress: '123 Merchant St, City A',
    deliveryAddress: '789 Another Ln, City C',
    recipientName: 'Customer Two',
    phone: '555-5678',
    price: 75.50,
    status: 'picked',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 'order-3',
    merchantId: 'user-1',
    pickupAddress: '123 Merchant St, City A',
    deliveryAddress: '101 New Rd, City D',
    recipientName: 'Customer Three',
    phone: '555-9012',
    price: 25.00,
    status: 'pending',
    createdAt: new Date().toISOString(), // Today
  },
  {
    id: 'order-4',
    merchantId: 'user-4', // Mock user not in MOCK_USERS
    pickupAddress: '404 Other St, City E',
    deliveryAddress: '500 Far Away, City F',
    recipientName: 'Customer Four',
    phone: '555-3456',
    price: 100.00,
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
];
