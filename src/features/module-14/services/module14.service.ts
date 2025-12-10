import axios from 'axios';
import {
    Module14,
    Module14Filters,
    CreateModule14DTO,
    UpdateModule14DTO,
    Module14ListResponse,
    BulkDeleteModule14Payload
} from '../types/module14';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

export interface Imodule14Service {
    getModule14(filters: Module14Filters): Promise<Module14ListResponse>;
    getModule14ById(id: string): Promise<Module14>;
    createModule14(data: CreateModule14DTO): Promise<Module14>;
    updateModule14(id: string, data: UpdateModule14DTO): Promise<Module14>;
    deleteModule14(id: string): Promise<void>;
    bulkDeleteModule14(payload: BulkDeleteModule14Payload): Promise<void>;
    exportModule14(filters: Module14Filters): Promise<Blob>;
}

class Mockmodule14Service implements Imodule14Service {
    private items: Module14[] = [
        {
            id: '1',
            name: 'Sample Module 13 Item',
            slug: 'sample-module-14-item',
            description: 'This is a sample module 13 item for testing',
            is_active: true,
            metadata: { category: 'test', priority: 1 },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Another Module 13',
            slug: 'another-module-14',
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

    async getModule14(filters: Module14Filters): Promise<Module14ListResponse> {
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

    async getModule14ById(id: string): Promise<Module14> {
        await new Promise(r => setTimeout(r, 300));
        const item = this.items.find(i => i.id === id);
        if (!item) throw new Error('Module14 not found');
        return item;
    }

    async createModule14(data: CreateModule14DTO): Promise<Module14> {
        await new Promise(r => setTimeout(r, 800));

        const newItem: Module14 = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        this.items.unshift(newItem);
        return newItem;
    }

    async updateModule14(id: string, data: UpdateModule14DTO): Promise<Module14> {
        await new Promise(r => setTimeout(r, 600));

        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Module14 not found');

        this.items[index] = {
            ...this.items[index],
            ...data,
            updated_at: new Date().toISOString()
        };

        return this.items[index];
    }

    async deleteModule14(id: string): Promise<void> {
        await new Promise(r => setTimeout(r, 500));
        this.items = this.items.filter(i => i.id !== id);
    }

    async bulkDeleteModule14(payload: BulkDeleteModule14Payload): Promise<void> {
        await new Promise(r => setTimeout(r, 800));
        this.items = this.items.filter(i => !payload.ids.includes(i.id));
    }

    async exportModule14(filters: Module14Filters): Promise<Blob> {
        await new Promise(r => setTimeout(r, 500));

        const data = await this.getModule14({ ...filters, limit: 1000, page: 1 });

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

class Realmodule14Service implements Imodule14Service {
    async getModule14(filters: Module14Filters): Promise<Module14ListResponse> {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters.sort_by) params.append('sort_by', filters.sort_by);
        if (filters.sort_order) params.append('sort_order', filters.sort_order);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.page) params.append('page', filters.page.toString());

        const res = await axios.get(`${API_BASE_URL}/Module14?${params}`);
        return res.data;
    }

    async getModule14ById(id: string): Promise<Module14> {
        const res = await axios.get(`${API_BASE_URL}/Module14/${id}`);
        return res.data;
    }

    async createModule14(data: CreateModule14DTO): Promise<Module14> {
        const res = await axios.post(`${API_BASE_URL}/Module14`, data);
        return res.data;
    }

    async updateModule14(id: string, data: UpdateModule14DTO): Promise<Module14> {
        const res = await axios.put(`${API_BASE_URL}/Module14/${id}`, data);
        return res.data;
    }

    async deleteModule14(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/Module14/${id}`);
    }

    async bulkDeleteModule14(payload: BulkDeleteModule14Payload): Promise<void> {
        await axios.post(`${API_BASE_URL}/Module14/bulk-delete`, payload);
    }

    async exportModule14(filters: Module14Filters): Promise<Blob> {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());

        const res = await axios.get(`${API_BASE_URL}/Module14/export?${params}`, {
            responseType: 'blob'
        });
        return res.data;
    }
}

export const module14Service: Imodule14Service = USE_MOCK ? new Mockmodule14Service() : new Realmodule14Service();



