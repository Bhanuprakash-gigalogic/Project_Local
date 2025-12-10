// Module14 entity
export interface Module14 {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

// Create DTO
export interface CreateModule14DTO {
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    metadata?: Record<string, any>;
}

// Update DTO
export interface UpdateModule14DTO {
    name?: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
    metadata?: Record<string, any>;
}

// List filters
export interface Module14Filters {
    search?: string;
    is_active?: boolean;
    sort_by?: 'name' | 'created_at';
    sort_order?: 'asc' | 'desc';
    limit?: number;
    page?: number;
}

// List response
export interface Module14ListResponse {
    items: Module14[];
    total: number;
    page: number;
    limit: number;
}

// Bulk delete payload
export interface BulkDeleteModule14Payload {
    ids: string[];
}



