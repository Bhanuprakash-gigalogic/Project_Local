// Store entity from backend
export interface Store {
    id: string;
    name: string;
    zone_id: string;
    zone_name?: string; // Populated from zone relationship
    description?: string;
    address: string;
    contact?: string;
    is_active: boolean;
    total_sellers?: number;
    total_products?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

// List filters
export interface StoreFilters {
    limit?: number;
    page?: number;
    zone_id?: string;
    search?: string;
    is_active?: boolean;
}

// Create DTO
export interface CreateStoreDTO {
    name: string;
    zone_id: string;
    description?: string;
    address: string;
    contact?: string;
    is_active: boolean;
}

// Update DTO
export interface UpdateStoreDTO {
    name?: string;
    zone_id?: string;
    description?: string;
    address?: string;
    contact?: string;
    is_active?: boolean;
}

// List response
export interface StoresListResponse {
    stores: Store[];
    total: number;
    page: number;
    limit: number;
}

// Bulk action payload
export interface BulkStoreActionPayload {
    store_ids: string[];
    action: 'activate' | 'deactivate' | 'delete';
}
