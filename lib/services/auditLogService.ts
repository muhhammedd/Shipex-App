import apiClient from '../api-client';
import { AuditLog, AuditLogFilters, AuditLogListResponse } from '@/types/auditLog';

class AuditLogService {
    private baseUrl = '/audit-logs';

    async getLogs(filters?: AuditLogFilters): Promise<AuditLogListResponse> {
        const response = await apiClient.get<AuditLogListResponse>(this.baseUrl, {
            params: filters,
        });
        return response.data;
    }

    async getLog(id: string): Promise<AuditLog> {
        const response = await apiClient.get<AuditLog>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async exportLogs(filters?: AuditLogFilters): Promise<Blob> {
        const response = await apiClient.get(`${this.baseUrl}/export`, {
            params: filters,
            responseType: 'blob',
        });
        return response.data;
    }
}

export const auditLogService = new AuditLogService();
