// Banner entity
export interface Banner {
    id: string;
    title: string;
    desktop_image_url: string;
    mobile_image_url?: string;
    target_type: 'global' | 'zone' | 'category' | 'store';
    target_id?: string;
    target_name?: string; // Populated from relationship
    click_url?: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    priority: number;
    created_at: string;
    updated_at: string;
}

// Create DTO
export interface CreateBannerDTO {
    title: string;
    desktop_image_url: string;
    mobile_image_url?: string;
    target_type: 'global' | 'zone' | 'category' | 'store';
    target_id?: string;
    click_url?: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    priority: number;
}

// Update DTO
export interface UpdateBannerDTO {
    title?: string;
    desktop_image_url?: string;
    mobile_image_url?: string;
    target_type?: 'global' | 'zone' | 'category' | 'store';
    target_id?: string;
    click_url?: string;
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
    priority?: number;
}

// List filters
export interface BannerFilters {
    target_type?: 'global' | 'zone' | 'category' | 'store';
    target_id?: string;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
    priority?: number;
    limit?: number;
    page?: number;
}

// Active banners query
export interface ActiveBannersQuery {
    zone_id?: string;
    category_id?: string;
    store_id?: string;
}

// Presigned upload
export interface PresignedUploadRequest {
    file_name: string;
    file_type: string;
}

export interface PresignedUploadResponse {
    upload_url: string;
    file_url: string;
    expires_in: number;
}

// Bulk actions
export interface BulkBannerActionPayload {
    banner_ids: string[];
    action: 'publish' | 'unpublish' | 'change_priority';
    priority?: number;
}

// List response
export interface BannersListResponse {
    banners: Banner[];
    total: number;
    page: number;
    limit: number;
}
