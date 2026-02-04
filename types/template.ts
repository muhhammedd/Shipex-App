export interface OrderTemplate {
    id: string;
    merchantId: string;
    name: string;
    description?: string;

    // Package Details
    packageType: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };

    // Pricing
    shippingCost?: number;
    codAmount?: number;

    // Recipient Template (can be partial)
    recipientName?: string;
    recipientPhone?: string;
    recipientCity?: string;
    recipientZone?: string;
    recipientAddress?: string;

    // Metadata
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTemplateDto {
    name: string;
    description?: string;
    packageType: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    shippingCost?: number;
    codAmount?: number;
    recipientName?: string;
    recipientPhone?: string;
    recipientCity?: string;
    recipientZone?: string;
    recipientAddress?: string;
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> { }

export interface TemplateListResponse {
    data: OrderTemplate[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface UseTemplateResponse {
    orderId: string;
    message: string;
}
