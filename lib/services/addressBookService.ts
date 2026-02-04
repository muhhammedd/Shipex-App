import apiClient from '../api-client';
import { Address, CreateAddressDto, UpdateAddressDto, AddressListResponse } from '@/types/address';

class AddressBookService {
    private baseUrl = '/addresses';

    async getAddresses(page = 1, limit = 20): Promise<AddressListResponse> {
        const response = await apiClient.get<AddressListResponse>(
            `${this.baseUrl}?page=${page}&limit=${limit}`
        );
        return response.data;
    }

    async getAddress(id: string): Promise<Address> {
        const response = await apiClient.get<Address>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async createAddress(data: CreateAddressDto): Promise<Address> {
        const response = await apiClient.post<Address>(this.baseUrl, data);
        return response.data;
    }

    async updateAddress(id: string, data: UpdateAddressDto): Promise<Address> {
        const response = await apiClient.put<Address>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    async deleteAddress(id: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/${id}`);
    }

    async setDefaultAddress(id: string): Promise<Address> {
        const response = await apiClient.patch<Address>(`${this.baseUrl}/${id}/default`);
        return response.data;
    }
}

export const addressBookService = new AddressBookService();
