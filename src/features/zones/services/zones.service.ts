import axios from 'axios';
import {
    BulkActionPayload,
    CreateZoneDTO,
    Store,
    UpdateZoneDTO,
    Zone,
    ZonesListResponse
} from '../types/zones.types';
import { isPointInPolygon } from '../utils/geo';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

export interface IZoneService {
    getZones(page?: number, limit?: number, search?: string, status?: string): Promise<ZonesListResponse>;
    getZoneById(id: string): Promise<Zone>;
    createZone(data: CreateZoneDTO): Promise<Zone>;
    updateZone(data: UpdateZoneDTO): Promise<Zone>;
    deleteZone(id: string): Promise<void>;
    bulkAction(payload: BulkActionPayload): Promise<void>;
    locateZone(lat: number, lng: number): Promise<Zone[]>;
    getStores(search?: string): Promise<Store[]>;
}

class MockZoneService implements IZoneService {
    private zones: Zone[] = [
        {
            id: '1',
            code: 'NYC-DT',
            name: 'Downtown NYC',
            description: 'Primary delivery zone for financial district',
            status: 'active',
            storeCount: 15,
            polygon: {
                type: 'Polygon',
                coordinates: [[
                    [-74.0060, 40.7128],
                    [-74.0160, 40.7228],
                    [-74.0060, 40.7328],
                    [-74.0060, 40.7128]
                ]]
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    async getZones(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<ZonesListResponse> {
        await new Promise(r => setTimeout(r, 600)); // Simulate net lag

        let filtered = [...this.zones];

        if (search) {
            const lower = search.toLowerCase();
            filtered = filtered.filter(z =>
                z.name.toLowerCase().includes(lower) ||
                z.code.toLowerCase().includes(lower)
            );
        }

        if (status && status !== 'all') {
            filtered = filtered.filter(z => z.status === status);
        }

        const start = (page - 1) * limit;
        return {
            data: filtered.slice(start, start + limit),
            total: filtered.length,
            page,
            limit
        };
    }

    async getZoneById(id: string): Promise<Zone> {
        await new Promise(r => setTimeout(r, 400));
        const zone = this.zones.find(z => z.id === id);
        if (!zone) throw new Error('Zone not found');
        return zone;
    }

    async createZone(data: CreateZoneDTO): Promise<Zone> {
        await new Promise(r => setTimeout(r, 800));

        // Check uniqueness
        if (this.zones.some(z => z.code === data.code)) {
            throw new Error('Zone code must be unique');
        }

        const newZone: Zone = {
            id: Math.random().toString(36).substring(2),
            ...data,
            storeCount: data.storeIds.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.zones.unshift(newZone);
        return newZone;
    }

    async updateZone(data: UpdateZoneDTO): Promise<Zone> {
        await new Promise(r => setTimeout(r, 600));
        const idx = this.zones.findIndex(z => z.id === data.id);
        if (idx === -1) throw new Error('Zone not found');

        const updated = {
            ...this.zones[idx],
            ...data,
            polygon: data.polygon || this.zones[idx].polygon, // Handle partial update
            updatedAt: new Date().toISOString()
        };

        // If storeIds provided, update count (mock logic)
        if (data.storeIds) {
            updated.storeCount = data.storeIds.length;
        }

        this.zones[idx] = updated;
        return updated;
    }

    async deleteZone(id: string): Promise<void> {
        await new Promise(r => setTimeout(r, 500));
        this.zones = this.zones.filter(z => z.id !== id);
    }

    async bulkAction(payload: BulkActionPayload): Promise<void> {
        await new Promise(r => setTimeout(r, 800));
        const { action, zoneIds } = payload;

        this.zones = this.zones.filter(z => {
            if (!zoneIds.includes(z.id)) return true;

            if (action === 'delete') return false; // Remove

            // Mutate for status changes
            if (action === 'activate') z.status = 'active';
            if (action === 'deactivate') z.status = 'inactive';
            return true;
        });
    }

    async locateZone(lat: number, lng: number): Promise<Zone[]> {
        await new Promise(r => setTimeout(r, 600));
        return this.zones.filter(z => isPointInPolygon(lat, lng, z.polygon));
    }

    async getStores(search?: string): Promise<Store[]> {
        await new Promise(r => setTimeout(r, 300));
        // Mock stores
        const stores = Array.from({ length: 20 }).map((_, i) => ({
            id: `s-${i}`,
            name: `Store ${i + 1} - ${search || 'Generic'}`,
            address: `${i * 10} Main St`
        }));
        return stores;
    }
}

class RealZoneService implements IZoneService {
    async getZones(page: number, limit: number, search?: string, status?: string): Promise<ZonesListResponse> {
        const params = { page, limit, search, status };
        const res = await axios.get(`${API_BASE_URL}/zones`, { params });
        return res.data;
    }
    async getZoneById(id: string): Promise<Zone> {
        const res = await axios.get(`${API_BASE_URL}/zones/${id}`);
        return res.data;
    }
    async createZone(data: CreateZoneDTO): Promise<Zone> {
        const res = await axios.post(`${API_BASE_URL}/zones`, data);
        return res.data;
    }
    async updateZone(data: UpdateZoneDTO): Promise<Zone> {
        const res = await axios.patch(`${API_BASE_URL}/zones/${data.id}`, data);
        return res.data;
    }
    async deleteZone(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/zones/${id}`);
    }
    async bulkAction(payload: BulkActionPayload): Promise<void> {
        await axios.post(`${API_BASE_URL}/zones/bulk`, payload);
    }
    async locateZone(lat: number, lng: number): Promise<Zone[]> {
        const res = await axios.get(`${API_BASE_URL}/zones/locate`, { params: { lat, lng } });
        return res.data;
    }
    async getStores(search?: string): Promise<Store[]> {
        const res = await axios.get(`${API_BASE_URL}/stores`, { params: { search } });
        return res.data;
    }
}

export const zoneService: IZoneService = USE_MOCK ? new MockZoneService() : new RealZoneService();
