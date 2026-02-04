export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
}

export interface AuditLogFilters {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface AuditLogListResponse {
    data: AuditLog[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}
