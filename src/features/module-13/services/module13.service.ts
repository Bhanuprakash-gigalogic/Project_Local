import axios from 'axios';
import {
    Module13,
    Module13Filters,
    CreateModule13DTO,
    UpdateModule13DTO,
    Module13ListResponse,
    BulkDeleteModule13Payload
} from '../types/module13';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

export interface IModule13Service {
    getModule13(filters: Module13Filters): Promise<Module13ListResponse>;
    getModule13ById(id: string): Promise<Module13>;
    createModule13(data: CreateModule13DTO): Promise<Module13>;
    updateModule13(id: string, data: UpdateModule13DTO): Promise<Module13>;
    deleteModule13(id: string): Promise<void>;
    bulkDeleteModule13(payload: BulkDeleteModule13Payload): Promise<void>;
    exportModule13(filters: Module13Filters): Promise<Blob>;
}

class MockModule13Service implements IModule13Service {
    private items: Module13[] = [
        {
            id: '1',
            name: 'Sample Module 13 Item',
            slug: 'sample-module-13-item',
            description: 'This is a sample module 13 item for testing',
            is_active: true,
            metadata: { category: 'test', priority: 1 },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Another Module 13',
            slug: 'another-module-13',
            description: 'Second sample item',
            is_active: true,
            metadata: { category: 'demo', priority: 2 },
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: '3',
            name: 'Inactive Module',
            slug: 'inactive-module',
            description: 'This one is inactive',
            is_active: false,
            metadata: { category: 'archived' },
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString(),
        },
    ];

    async getModule13(filters: Module13Filters): Promise<Module13ListResponse> {
        await new Promise(r => setTimeout(r, 500));

        let filtered = [...this.items];

        // Search filter
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(search) ||
                item.slug.toLowerCase().includes(search) ||
                item.description?.toLowerCase().includes(search)
            );
        }

        // Active filter
        if (filters.is_active !== undefined) {
            filtered = filtered.filter(item => item.is_active === filters.is_active);
        }

        // Sort
        const sortBy = filters.sort_by || 'created_at';
        const sortOrder = filters.sort_order || 'desc';
        filtered.sort((a, b) => {
            const aVal = sortBy === 'name' ? a.name : a.created_at;
            const bVal = sortBy === 'name' ? b.name : b.created_at;

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        // Pagination
        const limit = filters.limit || 10;
        const page = filters.page || 1;
        const offset = (page - 1) * limit;
        const paginated = filtered.slice(offset, offset + limit);

        return {
            items: paginated,
            total: filtered.length,
            page,
            limit
        };
    }

    async getModule13ById(id: string): Promise<Module13> {
        await new Promise(r => setTimeout(r, 300));
        const item = this.items.find(i => i.id === id);
        if (!item) throw new Error('Module13 not found');
        return item;
    }

    async createModule13(data: CreateModule13DTO): Promise<Module13> {
        await new Promise(r => setTimeout(r, 800));

        const newItem: Module13 = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        this.items.unshift(newItem);
        return newItem;
    }

    async updateModule13(id: string, data: UpdateModule13DTO): Promise<Module13> {
        await new Promise(r => setTimeout(r, 600));

        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Module13 not found');

        this.items[index] = {
            ...this.items[index],
            ...data,
            updated_at: new Date().toISOString()
        };

        return this.items[index];
    }

    async deleteModule13(id: string): Promise<void> {
        await new Promise(r => setTimeout(r, 500));
        this.items = this.items.filter(i => i.id !== id);
    }

    async bulkDeleteModule13(payload: BulkDeleteModule13Payload): Promise<void> {
        await new Promise(r => setTimeout(r, 800));
        this.items = this.items.filter(i => !payload.ids.includes(i.id));
    }

    async exportModule13(filters: Module13Filters): Promise<Blob> {
        await new Promise(r => setTimeout(r, 500));

        const data = await this.getModule13({ ...filters, limit: 1000, page: 1 });

        // Convert to CSV
        const headers = ['ID', 'Name', 'Slug', 'Description', 'Active', 'Metadata', 'Created At', 'Updated At'];
        const rows = data.items.map(item => [
            item.id,
            item.name,
            item.slug,
            item.description || '',
            item.is_active ? 'Yes' : 'No',
            JSON.stringify(item.metadata || {}),
            new Date(item.created_at).toLocaleString(),
            new Date(item.updated_at).toLocaleString()
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return new Blob([csv], { type: 'text/csv' });
    }
}

class RealModule13Service implements IModule13Service {
    async getModule13(filters: Module13Filters): Promise<Module13ListResponse> {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters.sort_by) params.append('sort_by', filters.sort_by);
        if (filters.sort_order) params.append('sort_order', filters.sort_order);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.page) params.append('page', filters.page.toString());

        const res = await axios.get(`${API_BASE_URL}/module13?${params}`);
        return res.data;
    }

    async getModule13ById(id: string): Promise<Module13> {
        const res = await axios.get(`${API_BASE_URL}/module13/${id}`);
        return res.data;
    }

    async createModule13(data: CreateModule13DTO): Promise<Module13> {
        const res = await axios.post(`${API_BASE_URL}/module13`, data);
        return res.data;
    }

    async updateModule13(id: string, data: UpdateModule13DTO): Promise<Module13> {
        const res = await axios.put(`${API_BASE_URL}/module13/${id}`, data);
        return res.data;
    }

    async deleteModule13(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/module13/${id}`);
    }

    async bulkDeleteModule13(payload: BulkDeleteModule13Payload): Promise<void> {
        await axios.post(`${API_BASE_URL}/module13/bulk-delete`, payload);
    }

    async exportModule13(filters: Module13Filters): Promise<Blob> {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());

        const res = await axios.get(`${API_BASE_URL}/module13/export?${params}`, {
            responseType: 'blob'
        });
        return res.data;
    }
}

export const module13Service: IModule13Service = USE_MOCK ? new MockModule13Service() : new RealModule13Service();
