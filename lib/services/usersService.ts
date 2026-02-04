import apiClient from '../api-client';
import { CreateUserRequest, UserResponse, UsersListResponse } from '@/types/api';
import { User } from '@/types/models';

export const usersService = {
    /**
     * Get all users in tenant (Admin only)
     */
    async getUsers(role?: string): Promise<UsersListResponse> {
        const response = await apiClient.get<UsersListResponse>('/users', {
            params: { role },
        });
        return response.data;
    },

    /**
     * Get users by tenant ID (Admin only)
     */
    async getUsersByTenant(tenantId: string): Promise<User[]> {
        const response = await apiClient.get<User[]>(`/tenants/${tenantId}/users`);
        return response.data;
    },

    /**
     * Get single user by ID
     */
    async getUserById(id: string): Promise<User> {
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    },

    /**
     * Create new user (Admin only)
     */
    async createUser(data: CreateUserRequest): Promise<UserResponse> {
        const response = await apiClient.post<UserResponse>('/users', data);
        return response.data;
    },

    /**
     * Update user
     */
    async updateUser(id: string, data: Partial<CreateUserRequest>): Promise<UserResponse> {
        const response = await apiClient.patch<UserResponse>(`/users/${id}`, data);
        return response.data;
    },

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<void> {
        await apiClient.delete(`/users/${id}`);
    },
};
