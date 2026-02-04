// User roles enum matching backend
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MERCHANT = 'MERCHANT',
  COURIER = 'COURIER',
}

// Order status enum
export enum OrderStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

// Subscription plan enum
export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

// Tenant status enum
export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL',
}

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  tenant?: Tenant;
  merchantProfile?: MerchantProfile;
  courierProfile?: CourierProfile;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tenant interface
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  plan: SubscriptionPlan;
  maxOrders: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  users?: User[];
}

// Merchant Profile
export interface MerchantProfile {
  id: string;
  userId: string;
  tenantId: string;
  companyName: string;
  businessName?: string;
  businessAddress?: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

// Courier Profile
export interface CourierProfile {
  id: string;
  userId: string;
  tenantId: string;
  vehicleInfo?: string;
  phoneNumber?: string;
  isAvailable?: boolean;
  lastLocation?: string;
  wallet: number;
  createdAt: string;
  updatedAt: string;
}

// Order interface
export interface Order {
  id: string;
  trackingNumber: string;
  tenantId: string;
  merchantId: string;
  courierId?: string;
  status: OrderStatus;

  // Recipient details
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  recipientZone?: string;

  // Package details
  packageDescription?: string;
  packageWeight?: number;
  packageDimensions?: string;

  // Financial
  declaredValue: number;
  shippingCost: number;
  codAmount?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;

  // Relations
  merchant?: User;
  courier?: User;
  tenant?: Tenant;
  history?: OrderHistory[];
}

// Order History
export interface OrderHistory {
  id: string;
  orderId: string;
  statusFrom: OrderStatus;
  statusTo: OrderStatus;
  timestamp: string;
  changedBy: {
    id: string;
    name: string;
  };
  location?: string;
  notes?: string;
}

// Transaction
export interface Transaction {
  id: string;
  tenantId: string;
  merchantId: string;
  orderId?: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  createdAt: string;
}

// Notification
export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}
