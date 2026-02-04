import apiClient from '../api-client';
import { CreateTenantRequest, TenantResponse, TenantsListResponse } from '@/types/api';
import { Tenant, TenantStatus } from '@/types/models';

export const tenantsService = {
    /**
     * Get all tenants (Super Admin only)
     */
    async getTenants(): Promise<TenantsListResponse> {
        const response = await apiClient.get<TenantsListResponse>('/tenants');
        return response.data;
    },

    /**
     * Get single tenant by ID
     */
    async getTenantById(id: string): Promise<Tenant> {
        const response = await apiClient.get<Tenant>(`/tenants/${id}`);
        return response.data;
    },

    /**
     * Create new tenant (Super Admin only)
     */
    async createTenant(data: CreateTenantRequest): Promise<TenantResponse> {
        const response = await apiClient.post<TenantResponse>('/tenants', data);
        return response.data;
    },

    /**
     * Update tenant status (Super Admin only)
     */
    async updateTenantStatus(id: string, status: TenantStatus): Promise<TenantResponse> {
        const response = await apiClient.patch<TenantResponse>(`/tenants/${id}/status`, {
            status,
        });
        return response.data;
    },

    /**
     * Suspend tenant (Super Admin only)
     */
    async suspendTenant(id: string): Promise<TenantResponse> {
        return this.updateTenantStatus(id, TenantStatus.SUSPENDED);
    },

    /**
     * Activate tenant (Super Admin only)
     */
    async activateTenant(id: string): Promise<TenantResponse> {
        return this.updateTenantStatus(id, TenantStatus.ACTIVE);
    },
};
