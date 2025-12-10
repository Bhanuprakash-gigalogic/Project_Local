// Seller entity
export interface Seller {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    is_active: boolean;
    created_at: string;
}

// Allocated seller with allocation metadata
export interface AllocatedSeller extends Seller {
    allocated_at: string;
    allocation_status: 'active' | 'pending' | 'inactive';
}

// Allocation progress for bulk operations
export interface AllocationProgress {
    total: number;
    completed: number;
    successful: number;
    failed: number;
    errors: AllocationError[];
}

// Allocation error details
export interface AllocationError {
    seller_id: string;
    seller_name: string;
    error_code: 'SELLER_ALREADY_ALLOCATED' | 'SELLER_NOT_FOUND' | 'UNKNOWN_ERROR';
    message: string;
}

// API request/response types
export interface AllocateSellerRequest {
    seller_id: string;
}

export interface BulkAllocateRequest {
    seller_ids: string[];
}

export interface AllocatedSellersResponse {
    sellers: AllocatedSeller[];
    total: number;
    page: number;
    limit: number;
}

export interface SearchSellersResponse {
    sellers: Seller[];
    total: number;
}
