import { mockOrders } from '../mock/orders';
import { Order, OrderStatus } from '../../types/order';

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | 'ALL';
  date?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const orderService = {
  /**
   * Fetches orders with filtering and pagination.
   * This mimics a backend API call.
   */
  async getOrders(
    filters: OrderFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Order>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...mockOrders];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.trackingNumber.toLowerCase().includes(search) ||
          order.merchantName.toLowerCase().includes(search) ||
          order.recipientName.toLowerCase().includes(search)
      );
    }

    if (filters.status && filters.status !== 'ALL') {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.date) {
      filtered = filtered.filter(
        (order) => new Date(order.createdAt).toISOString().split('T')[0] === filters.date
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = filtered.slice(offset, offset + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Fetches a single order by its tracking number or ID.
   */
  async getOrderById(id: string): Promise<Order | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // Check both ID and tracking number (supporting SPX- prefix)
    const order = mockOrders.find(
      (o) => o.id === id || o.trackingNumber === id || o.trackingNumber === `SPX-${id}`
    );
    
    return order || null;
  },

  /**
   * Updates an order status.
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const orderIndex = mockOrders.findIndex((o) => o.id === id || o.trackingNumber === id);
    
    if (orderIndex === -1) return null;
    
    const order = mockOrders[orderIndex];
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: `h-new-${Date.now()}`,
          statusFrom: order.status,
          statusTo: status,
          timestamp: new Date().toISOString(),
          changedBy: { id: 'admin-1', name: 'Admin' },
        },
        ...order.history,
      ],
    };
    
    // In a real app, we'd update the database here.
    // For mock purposes, we just return the updated object.
    return updatedOrder;
  }
};
