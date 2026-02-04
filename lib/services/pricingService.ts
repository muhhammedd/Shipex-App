import apiClient from '../api-client';

export interface PricingRule {
    basePrice: number;
    weightFactor: number;
    codFeePercent: number;
}

export interface ShippingCostResponse {
    shippingCost: number;
    breakdown: {
        basePrice: number;
        weightSurcharge: number;
        codFee: number;
    };
}

export const pricingService = {
    async calculateShipping(data: {
        recipientCity: string; // acting as Zone for now
        packageWeight: number;
        codAmount: number;
    }): Promise<ShippingCostResponse> {
        const response = await apiClient.post<ShippingCostResponse>('/pricing/calculate', data);
        return response.data;
    }
};
