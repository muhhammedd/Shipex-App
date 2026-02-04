import apiClient from '../api-client';
import {
    CreateOrderRequest,
    OrderResponse,
    OrdersListResponse,
    AssignCourierRequest,
    UpdateOrderStatusRequest,
    OrderFilters,
} from '@/types/api';
import { Order } from '@/types/models';

export const ordersApiService = {
    /**
     * Get all orders with filters (Admin/Merchant)
     */
    async getOrders(filters?: OrderFilters): Promise<OrdersListResponse> {
        const response = await apiClient.get<OrdersListResponse>('/orders', {
            params: filters,
        });
        return response.data;
    },

    /**
     * Get orders assigned to courier
     */
    async getAssignedOrders(): Promise<Order[]> {
        const response = await apiClient.get<Order[]>('/orders/assigned');
        return response.data;
    },

    /**
     * Get single order by ID
     */
    async getOrderById(id: string): Promise<Order> {
        const response = await apiClient.get<Order>(`/orders/${id}`);
        return response.data;
    },

    /**
     * Create new order (Merchant)
     */
    async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
        const response = await apiClient.post<OrderResponse>('/orders', data);
        return response.data;
    },

    /**
     * Assign courier to order (Admin)
     */
    async assignCourier(orderId: string, courierId: string): Promise<OrderResponse> {
        const response = await apiClient.patch<OrderResponse>(
            `/orders/${orderId}/assign`,
            { courierId }
        );
        return response.data;
    },

    /**
     * Update order status (Courier/Admin)
     */
    async updateOrderStatus(
        orderId: string,
        data: UpdateOrderStatusRequest
    ): Promise<OrderResponse> {
        const response = await apiClient.patch<OrderResponse>(
            `/orders/${orderId}/status`,
            data
        );
        return response.data;
    },

    /**
     * Get merchant's financial balance
     */
    async getMerchantBalance(): Promise<{ balance: number }> {
        const response = await apiClient.get<{ balance: number }>('/finance/balance');
        return response.data;
    },

    /**
     * Bulk update order status (Admin)
     */
    async bulkUpdateStatus(orderIds: string[], status: string): Promise<any> {
        const response = await apiClient.patch('/orders/bulk/status', {
            orderIds,
            status,
        });
        return response.data;
    },

    /**
     * Bulk assign courier (Admin)
     */
    async bulkAssignCourier(orderIds: string[], courierId: string): Promise<any> {
        const response = await apiClient.patch('/orders/bulk/assign', {
            orderIds,
            courierId,
        });
        return response.data;
    },
};
