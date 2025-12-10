import axios from 'axios';
import {
    Zone,
    ZoneFilters,
    CreateZoneDTO,
    UpdateZoneDTO,
    ZonesListResponse,
    LocateRequest,
    LocateResponse,
    BulkActionPayload,
    ZoneSellersResponse,
    AllocateSellerDTO,
    BulkAllocateSellersDTO,
    RemoveSellerDTO
} from '../types/zone';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

// Helper to check if point is in polygon (simple ray casting)
function isPointInPolygon(lat: number, lng: number, polygon: number[][]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect = ((yi > lat) !== (yj > lat))
            && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }
    return inside;
}

export interface IZoneService {
    getZones(filters: ZoneFilters): Promise<ZonesListResponse>;
    getZone(id: string): Promise<Zone>;
    createZone(data: CreateZoneDTO): Promise<Zone>;
    updateZone(id: string, data: UpdateZoneDTO): Promise<Zone>;
    deleteZone(id: string): Promise<void>;
    restoreZone(id: string): Promise<Zone>;
    locateZone(request: LocateRequest): Promise<LocateResponse>;
    bulkAction(payload: BulkActionPayload): Promise<void>;
    getZoneAllocations(zoneId: string): Promise<any>;
    allocateToZone(payload: any): Promise<void>;
    removeAllocation(payload: any): Promise<void>;
}

class MockZoneService implements IZoneService {
    private zones: Zone[] = [
        {
            id: '1',
            name: 'Downtown Manhattan',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            polygon_coords: [
                [-74.0060, 40.7128],
                [-74.0160, 40.7228],
                [-73.9960, 40.7328],
                [-73.9860, 40.7228],
                [-74.0060, 40.7128]
            ],
            is_active: true,
            seller_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Brooklyn Heights',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            polygon_coords: [
                [-73.9942, 40.6942],
                [-73.9842, 40.7042],
                [-73.9742, 40.6942],
                [-73.9842, 40.6842],
                [-73.9942, 40.6942]
            ],
            is_active: true,
            seller_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
    ];

    async getZones(filters: ZoneFilters): Promise<ZonesListResponse> {
        await new Promise(r => setTimeout(r, 500));

        let filtered = [...this.zones];

        // Apply filters
        if (filters.city) {
            filtered = filtered.filter(z => z.city.toLowerCase().includes(filters.city!.toLowerCase()));
        }
        if (filters.is_active !== undefined) {
            filtered = filtered.filter(z => z.is_active === filters.is_active);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(z =>
                z.name.toLowerCase().includes(search) ||
                z.city.toLowerCase().includes(search)
            );
        }

        // Pagination
        const limit = filters.limit || 10;
        const offset = filters.offset || 0;
        const paginated = filtered.slice(offset, offset + limit);

        return {
            zones: paginated,
            total: filtered.length,
            limit,
            offset
        };
    }

    async getZone(id: string): Promise<Zone> {
        await new Promise(r => setTimeout(r, 300));
        const zone = this.zones.find(z => z.id === id);
        if (!zone) throw new Error('Zone not found');
        return zone;
    }

    async createZone(data: CreateZoneDTO): Promise<Zone> {
        await new Promise(r => setTimeout(r, 800));

        const newZone: Zone = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            seller_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        this.zones.unshift(newZone);
        return newZone;
    }

    async updateZone(id: string, data: UpdateZoneDTO): Promise<Zone> {
        await new Promise(r => setTimeout(r, 600));

        const index = this.zones.findIndex(z => z.id === id);
        if (index === -1) throw new Error('Zone not found');

        this.zones[index] = {
            ...this.zones[index],
            ...data,
            updated_at: new Date().toISOString()
        };

        return this.zones[index];
    }

    async deleteZone(id: string): Promise<void> {
        await new Promise(r => setTimeout(r, 500));

        const index = this.zones.findIndex(z => z.id === id);
        if (index === -1) throw new Error('Zone not found');

        // Soft delete
        this.zones[index].deleted_at = new Date().toISOString();
        this.zones[index].is_active = false;
    }

    async restoreZone(id: string): Promise<Zone> {
        await new Promise(r => setTimeout(r, 500));

        const index = this.zones.findIndex(z => z.id === id);
        if (index === -1) throw new Error('Zone not found');

        this.zones[index].deleted_at = null;
        this.zones[index].updated_at = new Date().toISOString();

        return this.zones[index];
    }

    async locateZone(request: LocateRequest): Promise<LocateResponse> {
        await new Promise(r => setTimeout(r, 600));

        const matchedZones = this.zones.filter(zone =>
            !zone.deleted_at &&
            isPointInPolygon(request.lat, request.lng, zone.polygon_coords)
        );

        return { zones: matchedZones };
    }

    async bulkAction(payload: BulkActionPayload): Promise<void> {
        await new Promise(r => setTimeout(r, 800));

        payload.zone_ids.forEach(id => {
            const index = this.zones.findIndex(z => z.id === id);
            if (index !== -1) {
                if (payload.action === 'activate') {
                    this.zones[index].is_active = true;
                } else if (payload.action === 'deactivate') {
                    this.zones[index].is_active = false;
                } else if (payload.action === 'delete') {
                    this.zones[index].deleted_at = new Date().toISOString();
                    this.zones[index].is_active = false;
                }
                this.zones[index].updated_at = new Date().toISOString();
            }
        });
    }

    async getZoneAllocations(zoneId: string): Promise<any> {
        await new Promise(r => setTimeout(r, 400));
        return { sellers: [], total: 0 };
    }

    async allocateToZone(payload: any): Promise<void> {
        await new Promise(r => setTimeout(r, 600));
    }

    async removeAllocation(payload: any): Promise<void> {
        await new Promise(r => setTimeout(r, 600));
    }
}

class RealZoneService implements IZoneService {
    async getZones(filters: ZoneFilters): Promise<ZonesListResponse> {
        const params = new URLSearchParams();
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());
        if (filters.city) params.append('city', filters.city);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);

        const res = await axios.get(`${API_BASE_URL}/zones?${params}`);
        return res.data;
    }

    async getZone(id: string): Promise<Zone> {
        const res = await axios.get(`${API_BASE_URL}/zones/${id}`);
        return res.data;
    }

    async createZone(data: CreateZoneDTO): Promise<Zone> {
        const res = await axios.post(`${API_BASE_URL}/zones`, data);
        return res.data;
    }

    async updateZone(id: string, data: UpdateZoneDTO): Promise<Zone> {
        const res = await axios.put(`${API_BASE_URL}/zones/${id}`, data);
        return res.data;
    }

    async deleteZone(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/zones/${id}`);
    }

    async restoreZone(id: string): Promise<Zone> {
        await axios.post(`${API_BASE_URL}/zones/${id}/restore`);
        const res = await axios.get(`${API_BASE_URL}/zones/${id}`);
        return res.data;
    }

    async locateZone(request: LocateRequest): Promise<LocateResponse> {
        const res = await axios.post(`${API_BASE_URL}/zones/locate`, request);
        return res.data;
    }

    async bulkAction(payload: BulkActionPayload): Promise<void> {
        await axios.post(`${API_BASE_URL}/zones/bulk`, payload);
    }

    async getZoneAllocations(zoneId: string): Promise<ZoneSellersResponse> {
        const res = await axios.get(`${API_BASE_URL}/zones/${zoneId}/allocations`);
        return res.data;
    }

    async allocateToZone(payload: AllocateSellerDTO | BulkAllocateSellersDTO): Promise<void> {
        await axios.post(`${API_BASE_URL}/zones/allocations`, payload);
    }

    async removeAllocation(payload: RemoveSellerDTO): Promise<void> {
        await axios.delete(`${API_BASE_URL}/zones/${payload.zone_id}/allocations/${payload.seller_id}`);
    }
}

export const zoneService: IZoneService = USE_MOCK ? new MockZoneService() : new RealZoneService();
