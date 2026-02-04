export interface ImportRow {
    rowNumber: number;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    recipientCity: string;
    recipientZone?: string;
    packageType: string;
    weight?: number;
    codAmount?: number;
    notes?: string;
    errors?: string[];
    isValid: boolean;
}

export interface ImportValidationResponse {
    isValid: boolean;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    rows: ImportRow[];
    errors: string[];
}

export interface ImportRequest {
    rows: Omit<ImportRow, 'rowNumber' | 'errors' | 'isValid'>[];
}

export interface ImportResponse {
    importId: string;
    totalOrders: number;
    successCount: number;
    failureCount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdOrders: string[];
    errors: Array<{
        rowNumber: number;
        error: string;
    }>;
}

export interface ImportStatus {
    importId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    totalOrders: number;
    processedOrders: number;
    successCount: number;
    failureCount: number;
    errors: Array<{
        rowNumber: number;
        error: string;
    }>;
}
