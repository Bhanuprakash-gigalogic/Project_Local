import axios from 'axios';
import {
    Store,
    StoreFilters,
    CreateStoreDTO,
    UpdateStoreDTO,
    StoresListResponse,
    BulkStoreActionPayload
} from '../types/store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

export interface IStoreService {
    getStores(filters: StoreFilters): Promise<StoresListResponse>;
    getStore(id: string): Promise<Store>;
    createStore(data: CreateStoreDTO): Promise<Store>;
    updateStore(id: string, data: UpdateStoreDTO): Promise<Store>;
    deleteStore(id: string): Promise<void>;
    restoreStore(id: string): Promise<Store>;
    bulkAction(payload: BulkStoreActionPayload): Promise<void>;
}

class MockStoreService implements IStoreService {
    private stores: Store[] = [
        {
            id: '1',
            name: 'Downtown Store',
            zone_id: '1',
            zone_name: 'Downtown Manhattan',
            description: 'Main flagship store in downtown area',
            address: '123 Main St, New York, NY 10001',
            contact: '+1-555-0101',
            is_active: true,
            total_sellers: 15,
            total_products: 450,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Brooklyn Store',
            zone_id: '2',
            zone_name: 'Brooklyn Heights',
            description: 'Brooklyn branch location',
            address: '456 Brooklyn Ave, Brooklyn, NY 11201',
            contact: '+1-555-0102',
            is_active: true,
            total_sellers: 8,
            total_products: 280,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
    ];

    async getStores(filters: StoreFilters): Promise<StoresListResponse> {
        await new Promise(r => setTimeout(r, 500));

        let filtered = [...this.stores].filter(s => !s.deleted_at);

        // Apply filters
        if (filters.zone_id) {
            filtered = filtered.filter(s => s.zone_id === filters.zone_id);
        }
        if (filters.is_active !== undefined) {
            filtered = filtered.filter(s => s.is_active === filters.is_active);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(search) ||
                s.address.toLowerCase().includes(search)
            );
        }

        // Pagination
        const limit = filters.limit || 10;
        const page = filters.page || 1;
        const offset = (page - 1) * limit;
        const paginated = filtered.slice(offset, offset + limit);

        return {
            stores: paginated,
            total: filtered.length,
            page,
            limit
        };
    }

    async getStore(id: string): Promise<Store> {
        await new Promise(r => setTimeout(r, 300));
        const store = this.stores.find(s => s.id === id);
        if (!store) throw new Error('Store not found');
        return store;
    }

    async createStore(data: CreateStoreDTO): Promise<Store> {
        await new Promise(r => setTimeout(r, 800));

        const newStore: Store = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            total_sellers: 0,
            total_products: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        this.stores.unshift(newStore);
        return newStore;
    }

    async updateStore(id: string, data: UpdateStoreDTO): Promise<Store> {
        await new Promise(r => setTimeout(r, 600));

        const index = this.stores.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Store not found');

        this.stores[index] = {
            ...this.stores[index],
            ...data,
            updated_at: new Date().toISOString()
        };

        return this.stores[index];
    }

    async deleteStore(id: string): Promise<void> {
        await new Promise(r => setTimeout(r, 500));

        const index = this.stores.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Store not found');

        // Soft delete
        this.stores[index].deleted_at = new Date().toISOString();
        this.stores[index].is_active = false;
    }

    async restoreStore(id: string): Promise<Store> {
        await new Promise(r => setTimeout(r, 500));

        const index = this.stores.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Store not found');

        this.stores[index].deleted_at = null;
        this.stores[index].updated_at = new Date().toISOString();

        return this.stores[index];
    }

    async bulkAction(payload: BulkStoreActionPayload): Promise<void> {
        await new Promise(r => setTimeout(r, 800));

        payload.store_ids.forEach(id => {
            const index = this.stores.findIndex(s => s.id === id);
            if (index !== -1) {
                if (payload.action === 'activate') {
                    this.stores[index].is_active = true;
                } else if (payload.action === 'deactivate') {
                    this.stores[index].is_active = false;
                } else if (payload.action === 'delete') {
                    this.stores[index].deleted_at = new Date().toISOString();
                    this.stores[index].is_active = false;
                }
                this.stores[index].updated_at = new Date().toISOString();
            }
        });
    }
}

class RealStoreService implements IStoreService {
    async getStores(filters: StoreFilters): Promise<StoresListResponse> {
        const params = new URLSearchParams();
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.zone_id) params.append('zone_id', filters.zone_id);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters.search) params.append('search', filters.search);

        const res = await axios.get(`${API_BASE_URL}/stores?${params}`);
        return res.data;
    }

    async getStore(id: string): Promise<Store> {
        const res = await axios.get(`${API_BASE_URL}/stores/${id}`);
        return res.data;
    }

    async createStore(data: CreateStoreDTO): Promise<Store> {
        const res = await axios.post(`${API_BASE_URL}/stores`, data);
        return res.data;
    }

    async updateStore(id: string, data: UpdateStoreDTO): Promise<Store> {
        const res = await axios.put(`${API_BASE_URL}/stores/${id}`, data);
        return res.data;
    }

    async deleteStore(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/stores/${id}`);
    }

    async restoreStore(id: string): Promise<Store> {
        const res = await axios.post(`${API_BASE_URL}/stores/${id}/restore`);
        return res.data;
    }

    async bulkAction(payload: BulkStoreActionPayload): Promise<void> {
        await axios.post(`${API_BASE_URL}/stores/bulk`, payload);
    }
}

export const storeService: IStoreService = USE_MOCK ? new MockStoreService() : new RealStoreService();
