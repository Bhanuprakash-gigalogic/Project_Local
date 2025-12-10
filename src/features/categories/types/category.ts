// Category entity
export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    icon_url?: string;
    banner_url?: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
    product_count?: number; // For deletion safety check
    created_at: string;
    updated_at: string;
}

// Category tree node (recursive)
export interface CategoryTree extends Category {
    children: CategoryTree[];
    level: number;
}

// Create DTO
export interface CreateCategoryDTO {
    name: string;
    slug: string;
    parent_id: string | null;
    icon_url?: string;
    banner_url?: string;
    description?: string;
    is_active: boolean;
    sort_order?: number;
}

// Update DTO
export interface UpdateCategoryDTO {
    name?: string;
    slug?: string;
    parent_id?: string | null;
    icon_url?: string;
    banner_url?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
}

// Reorder payload
export interface ReorderCategoryDTO {
    new_sort_order: number;
    new_parent_id?: string | null;
}

// Delete response (with product count warning)
export interface DeleteCategoryResponse {
    success: boolean;
    message?: string;
    product_count?: number;
    can_delete: boolean;
}

// List filters
export interface CategoryFilters {
    parent_id?: string | null;
    is_active?: boolean;
    search?: string;
    zone_id?: string;
}

// Tree response
export interface CategoryTreeResponse {
    categories: CategoryTree[];
    total: number;
}
