// Module13 entity
export interface Module13 {
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
export interface CreateModule13DTO {
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    metadata?: Record<string, any>;
}

// Update DTO
export interface UpdateModule13DTO {
    name?: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
    metadata?: Record<string, any>;
}

// List filters
export interface Module13Filters {
    search?: string;
    is_active?: boolean;
    sort_by?: 'name' | 'created_at';
    sort_order?: 'asc' | 'desc';
    limit?: number;
    page?: number;
}

// List response
export interface Module13ListResponse {
    items: Module13[];
    total: number;
    page: number;
    limit: number;
}

// Bulk delete payload
export interface BulkDeleteModule13Payload {
    ids: string[];
}
