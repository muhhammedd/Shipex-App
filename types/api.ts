import { User, Order, Tenant, OrderStatus } from './models';

// Authentication
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

// Orders
export interface CreateOrderRequest {
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    recipientCity: string;
    recipientZone?: string;
    packageDescription?: string;
    packageWeight?: number;
    packageDimensions?: string;
    declaredValue: number;
    codAmount?: number;
}

export interface OrderResponse {
    order: Order;
}

export interface OrdersListResponse {
    data: Order[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AssignCourierRequest {
    courierId: string;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
    notes?: string;
}

// Tenants
export interface CreateTenantRequest {
    name: string;
    domain: string;
    subscriptionPlan: string;
    adminEmail: string;
    adminName: string;
    adminPassword: string;
}

export interface TenantResponse {
    tenant: Tenant;
}

export interface TenantsListResponse {
    data: Tenant[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Users
export interface CreateUserRequest {
    email: string;
    name: string;
    password: string;
    role: string;
    phoneNumber?: string;
    businessName?: string;
    businessAddress?: string;
}

export interface UserResponse {
    user: User;
}

export interface UsersListResponse {
    data: User[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Generic API Response
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
}

// Analytics & Reporting
export interface AdminStatsSummary {
    totalOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    activeMerchants: number;
    activeCouriers: number;
    recentTrend: number; // percentage change
}

export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

export interface AnalyticsResponse {
    summary: AdminStatsSummary;
    orderVolume: ChartDataPoint[];
    revenueGrowth: ChartDataPoint[];
    topZones?: { name: string; orders: number; revenue: number }[];
    topMerchants?: { name: string; orders: number; revenue: number }[];
}

export interface OrderFilters extends PaginationParams {
    status?: OrderStatus;
    search?: string;
    merchantId?: string;
    courierId?: string;
    startDate?: string;
    endDate?: string;
}
