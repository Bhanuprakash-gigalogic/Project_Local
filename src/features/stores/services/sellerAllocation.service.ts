import axios from 'axios';
import {
    Seller,
    AllocatedSeller,
    SearchSellersResponse,
    AllocatedSellersResponse,
    AllocateSellerRequest,
    BulkAllocateRequest,
} from '../types/sellerAllocation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

export interface ISellerAllocationService {
    searchSellers(query: string): Promise<SearchSellersResponse>;
    getStoreSellers(storeId: string, page?: number, limit?: number): Promise<AllocatedSellersResponse>;
    allocateSeller(storeId: string, sellerId: string): Promise<AllocatedSeller>;
    bulkAllocateSellers(storeId: string, sellerIds: string[]): Promise<void>;
    removeSeller(storeId: string, sellerId: string): Promise<void>;
    removeAllSellers(storeId: string): Promise<void>;
}

class MockSellerAllocationService implements ISellerAllocationService {
    private sellers: Seller[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1-555-0101',
            is_active: true,
            created_at: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1-555-0102',
            is_active: true,
            created_at: new Date().toISOString(),
        },
        {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '+1-555-0103',
            is_active: true,
            created_at: new Date().toISOString(),
        },
        {
            id: '4',
            name: 'Alice Williams',
            email: 'alice@example.com',
            phone: '+1-555-0104',
            is_active: true,
            created_at: new Date().toISOString(),
        },
        {
            id: '5',
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            phone: '+1-555-0105',
            is_active: false,
            created_at: new Date().toISOString(),
        },
    ];

    private allocations: Map<string, AllocatedSeller[]> = new Map();

    async searchSellers(query: string): Promise<SearchSellersResponse> {
        await new Promise(r => setTimeout(r, 400));

        const filtered = this.sellers.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.email.toLowerCase().includes(query.toLowerCase())
        );

        return {
            sellers: filtered,
            total: filtered.length,
        };
    }

    async getStoreSellers(storeId: string, page = 1, limit = 10): Promise<AllocatedSellersResponse> {
        await new Promise(r => setTimeout(r, 300));

        const allocated = this.allocations.get(storeId) || [];
        const offset = (page - 1) * limit;
        const paginated = allocated.slice(offset, offset + limit);

        return {
            sellers: paginated,
            total: allocated.length,
            page,
            limit,
        };
    }

    async allocateSeller(storeId: string, sellerId: string): Promise<AllocatedSeller> {
        await new Promise(r => setTimeout(r, 500));

        const seller = this.sellers.find(s => s.id === sellerId);
        if (!seller) {
            throw new Error('SELLER_NOT_FOUND');
        }

        const allocated = this.allocations.get(storeId) || [];
        const alreadyAllocated = allocated.find(s => s.id === sellerId);

        if (alreadyAllocated) {
            throw new Error('SELLER_ALREADY_ALLOCATED');
        }

        const allocatedSeller: AllocatedSeller = {
            ...seller,
            allocated_at: new Date().toISOString(),
            allocation_status: 'active',
        };

        this.allocations.set(storeId, [...allocated, allocatedSeller]);
        return allocatedSeller;
    }

    async bulkAllocateSellers(storeId: string, sellerIds: string[]): Promise<void> {
        // This is handled by the hook with individual calls
        await new Promise(r => setTimeout(r, 100));
    }

    async removeSeller(storeId: string, sellerId: string): Promise<void> {
        await new Promise(r => setTimeout(r, 400));

        const allocated = this.allocations.get(storeId) || [];
        const filtered = allocated.filter(s => s.id !== sellerId);
        this.allocations.set(storeId, filtered);
    }

    async removeAllSellers(storeId: string): Promise<void> {
        await new Promise(r => setTimeout(r, 600));
        this.allocations.set(storeId, []);
    }
}

class RealSellerAllocationService implements ISellerAllocationService {
    async searchSellers(query: string): Promise<SearchSellersResponse> {
        const res = await axios.get(`${API_BASE_URL}/sellers?search=${encodeURIComponent(query)}`);
        return res.data;
    }

    async getStoreSellers(storeId: string, page = 1, limit = 10): Promise<AllocatedSellersResponse> {
        const res = await axios.get(`${API_BASE_URL}/stores/${storeId}/sellers?page=${page}&limit=${limit}`);
        return res.data;
    }

    async allocateSeller(storeId: string, sellerId: string): Promise<AllocatedSeller> {
        const res = await axios.post(`${API_BASE_URL}/stores/${storeId}/sellers`, { seller_id: sellerId });
        return res.data;
    }

    async bulkAllocateSellers(storeId: string, sellerIds: string[]): Promise<void> {
        await axios.post(`${API_BASE_URL}/stores/${storeId}/sellers/bulk`, { seller_ids: sellerIds });
    }

    async removeSeller(storeId: string, sellerId: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/stores/${storeId}/sellers/${sellerId}`);
    }

    async removeAllSellers(storeId: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/stores/${storeId}/sellers`);
    }
}

export const sellerAllocationService: ISellerAllocationService = USE_MOCK
    ? new MockSellerAllocationService()
    : new RealSellerAllocationService();
