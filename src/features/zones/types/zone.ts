// Zone entity from backend
export interface Zone {
    id: string;
    name: string;
    city: string;
    state?: string;
    country: string;
    polygon_coords: number[][]; // Array of [lng, lat] pairs
    is_active: boolean;
    seller_count?: number; // Count of allocated sellers
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface GeoJSONPolygon {
    type: 'Polygon';
    coordinates: number[][][]; // [ [lng, lat], [lng, lat], ... ]
}

// Seller entity
export interface Seller {
    id: string;
    name: string;
    email: string;
    phone: string;
    is_active: boolean;
    created_at: string;
}

// Zone-Seller allocation
export interface ZoneSeller {
    id: string;
    zone_id: string;
    seller_id: string;
    seller_name: string;
    seller_phone: string;
    seller_email: string;
    allocated_at: string;
    allocated_by?: string;
}

// List filters
export interface ZoneFilters {
    limit?: number;
    offset?: number;
    city?: string;
    is_active?: boolean;
    search?: string;
    sort?: string;
}

// Seller search filters
export interface SellerFilters {
    search?: string;
    limit?: number;
    offset?: number;
    is_active?: boolean;
}

// Create DTO
export interface CreateZoneDTO {
    name: string;
    city: string;
    state?: string;
    country: string;
    polygon_coords: number[][];
    is_active: boolean;
}

// Update DTO
export interface UpdateZoneDTO {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    polygon_coords?: number[][];
    is_active?: boolean;
}

// Locate request/response
export interface LocateRequest {
    lat: number;
    lng: number;
}

export interface LocateResponse {
    zones: Zone[];
}

// List response
export interface ZonesListResponse {
    zones: Zone[];
    total: number;
    limit: number;
    offset: number;
}

// Sellers list response
export interface SellersListResponse {
    sellers: Seller[];
    total: number;
    limit: number;
    offset: number;
}

// Zone sellers response
export interface ZoneSellersResponse {
    sellers: ZoneSeller[];
    total: number;
}

// Bulk action payload
export interface BulkActionPayload {
    zone_ids: string[];
    action: 'activate' | 'deactivate' | 'delete';
}

// Seller allocation payloads
export interface AllocateSellerDTO {
    zone_id: string;
    seller_id: string;
}

export interface BulkAllocateSellersDTO {
    zone_id: string;
    seller_ids: string[];
}

export interface RemoveSellerDTO {
    zone_id: string;
    seller_id: string;
}
