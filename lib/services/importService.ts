import apiClient from '../api-client';
import { ImportValidationResponse, ImportRequest, ImportResponse, ImportStatus } from '@/types/import';

class ImportService {
    private baseUrl = '/orders/import';

    async validateFile(file: File): Promise<ImportValidationResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<ImportValidationResponse>(
            `${this.baseUrl}/validate`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    async importOrders(data: ImportRequest): Promise<ImportResponse> {
        const response = await apiClient.post<ImportResponse>(this.baseUrl, data);
        return response.data;
    }

    async getImportStatus(importId: string): Promise<ImportStatus> {
        const response = await apiClient.get<ImportStatus>(`${this.baseUrl}/${importId}/status`);
        return response.data;
    }

    async downloadSampleTemplate(): Promise<Blob> {
        const response = await apiClient.get(`${this.baseUrl}/template`, {
            responseType: 'blob',
        });
        return response.data;
    }

    // Helper to parse CSV file on client side
    parseCSV(content: string): any[] {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row: any = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            rows.push(row);
        }

        return rows;
    }
}

export const importService = new ImportService();
