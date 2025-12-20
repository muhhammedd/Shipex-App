export type Role = 'merchant' | 'courier' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isAuthenticated: boolean;
}

export type OrderStatus = 'pending' | 'picked' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  merchantId: string;
  courierId?: string;
  pickupAddress: string;
  deliveryAddress: string;
  recipientName: string;
  phone: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface DataContextType {
  orders: Order[];
  users: User[];
  createOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  assignCourier: (orderId: string, courierId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}
