import apiClient from '../api-client';

export interface Zone {
    id: string;
    name: string;
    basePrice: number;
    pricePerKg: number;
    description?: string;
    isActive: boolean;
}

export interface PayoutRequest {
    id: string;
    merchantName: string;
    amount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date: string;
}

// Mock data to start with (since backend endpoints might not be fully ready for admin actions)
const MOCK_ZONES: Zone[] = [
    { id: '1', name: 'Cairo', basePrice: 50, pricePerKg: 5, description: 'Greater Cairo Area', isActive: true },
    { id: '2', name: 'Alexandria', basePrice: 65, pricePerKg: 7, description: 'Coastal Cities', isActive: true },
    { id: '3', name: 'Delta', basePrice: 75, pricePerKg: 8, description: 'Delta Region', isActive: false },
];

const MOCK_PAYOUTS: PayoutRequest[] = [
    { id: '101', merchantName: 'Tech Store EG', amount: 5000, status: 'PENDING', date: '2024-03-15' },
    { id: '102', merchantName: 'Fashion Hub', amount: 1250, status: 'PENDING', date: '2024-03-14' },
    { id: '103', merchantName: 'Gadget World', amount: 3200, status: 'APPROVED', date: '2024-03-10' },
];

export const adminService = {
    // Zone Management
    async getZones(): Promise<Zone[]> {
        // In real app: return apiClient.get('/admin/zones').then(res => res.data);
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_ZONES]), 500));
    },

    async createZone(zone: Omit<Zone, 'id'>): Promise<Zone> {
        return new Promise(resolve => setTimeout(() => resolve({ ...zone, id: Math.random().toString() }), 500));
    },

    async updateZone(id: string, updates: Partial<Zone>): Promise<Zone> {
        return new Promise(resolve => setTimeout(() => resolve({ ...MOCK_ZONES[0], ...updates, id } as Zone), 500)); // Simplified return
    },

    // Payout Management
    async getPayoutRequests(): Promise<PayoutRequest[]> {
        // In real app: return apiClient.get('/admin/payouts').then(res => res.data);
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_PAYOUTS]), 500));
    },

    async approvePayout(id: string): Promise<void> {
        // In real app: return apiClient.post(`/admin/payouts/${id}/approve`);
        return new Promise(resolve => setTimeout(resolve, 500));
    },

    async rejectPayout(id: string): Promise<void> {
        // In real app: return apiClient.post(`/admin/payouts/${id}/reject`);
        return new Promise(resolve => setTimeout(resolve, 500));
    }
};
