import apiClient from '../api-client';
import { OrderTemplate, CreateTemplateDto, UpdateTemplateDto, TemplateListResponse, UseTemplateResponse } from '@/types/template';

class TemplatesService {
    private baseUrl = '/templates';

    async getTemplates(page = 1, limit = 20): Promise<TemplateListResponse> {
        const response = await apiClient.get<TemplateListResponse>(
            `${this.baseUrl}?page=${page}&limit=${limit}`
        );
        return response.data;
    }

    async getTemplate(id: string): Promise<OrderTemplate> {
        const response = await apiClient.get<OrderTemplate>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async createTemplate(data: CreateTemplateDto): Promise<OrderTemplate> {
        const response = await apiClient.post<OrderTemplate>(this.baseUrl, data);
        return response.data;
    }

    async updateTemplate(id: string, data: UpdateTemplateDto): Promise<OrderTemplate> {
        const response = await apiClient.put<OrderTemplate>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    async deleteTemplate(id: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/${id}`);
    }

    async duplicateTemplate(id: string): Promise<OrderTemplate> {
        const response = await apiClient.post<OrderTemplate>(`${this.baseUrl}/${id}/duplicate`);
        return response.data;
    }

    async useTemplate(id: string, additionalData?: any): Promise<UseTemplateResponse> {
        const response = await apiClient.post<UseTemplateResponse>(
            `${this.baseUrl}/${id}/use`,
            additionalData
        );
        return response.data;
    }
}

export const templatesService = new TemplatesService();
