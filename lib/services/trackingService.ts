import apiClient from '../api-client';
import { Order } from '@/types/models';

class TrackingService {
    async trackOrder(trackingNumber: string): Promise<Order> {
        // Public endpoint - no auth required
        const response = await apiClient.get<Order>(`/public/tracking/${trackingNumber}`);
        return response.data;
    }
}

export const trackingService = new TrackingService();
