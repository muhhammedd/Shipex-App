import apiClient from '../api-client';
import { AnalyticsResponse } from '@/types/api';

export const analyticsService = {
    /**
     * Get platform analytics summary for admin
     */
    async getAdminSummary(): Promise<AnalyticsResponse> {
        const response = await apiClient.get<AnalyticsResponse>('/analytics/admin/summary');
        return response.data;
    },

    /**
     * Get merchant-specific analytics
     */
    async getMerchantSummary(merchantId: string): Promise<AnalyticsResponse> {
        const response = await apiClient.get<AnalyticsResponse>(`/analytics/merchant/${merchantId}`);
        return response.data;
    }
};
