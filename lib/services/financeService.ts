import apiClient from '../api-client';
import { Transaction } from '@/types/models';

export interface BalanceResponse {
    balance: number;
    currency: string;
}

export const financeService = {
    async getBalance(): Promise<BalanceResponse> {
        const response = await apiClient.get<BalanceResponse>('/finance/balance');
        return response.data;
    },

    async getTransactions(): Promise<Transaction[]> {
        const response = await apiClient.get<Transaction[]>('/finance/transactions');
        return response.data;
    }
};
