import axios from 'axios';
import {
    Banner,
    BannerFilters,
    CreateBannerDTO,
    UpdateBannerDTO,
    BannersListResponse,
    ActiveBannersQuery,
    PresignedUploadRequest,
    PresignedUploadResponse,
    BulkBannerActionPayload
} from '../types/banner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

export interface IBannerService {
    getBanners(filters: BannerFilters): Promise<BannersListResponse>;
    getBanner(id: string): Promise<Banner>;
    createBanner(data: CreateBannerDTO): Promise<Banner>;
    updateBanner(id: string, data: UpdateBannerDTO): Promise<Banner>;
    toggleBannerStatus(id: string, is_active: boolean): Promise<Banner>;
    deleteBanner(id: string): Promise<void>;
    getActiveBanners(query: ActiveBannersQuery): Promise<Banner[]>;
    getPresignedUploadUrl(request: PresignedUploadRequest): Promise<PresignedUploadResponse>;
    bulkAction(payload: BulkBannerActionPayload): Promise<void>;
}

class MockBannerService implements IBannerService {
    private banners: Banner[] = [
        {
            id: '1',
            title: 'Summer Sale 2024',
            desktop_image_url: 'https://via.placeholder.com/1200x400/2E7D32/FFFFFF?text=Summer+Sale',
            mobile_image_url: 'https://via.placeholder.com/600x300/2E7D32/FFFFFF?text=Summer+Sale',
            target_type: 'global',
            click_url: 'https://example.com/summer-sale',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true,
            priority: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            title: 'Electronics Zone Promo',
            desktop_image_url: 'https://via.placeholder.com/1200x400/1976D2/FFFFFF?text=Electronics',
            mobile_image_url: 'https://via.placeholder.com/600x300/1976D2/FFFFFF?text=Electronics',
            target_type: 'zone',
            target_id: '1',
            target_name: 'Downtown Manhattan',
            click_url: 'https://example.com/electronics',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true,
            priority: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '3',
            title: 'Category Special Offer',
            desktop_image_url: 'https://via.placeholder.com/1200x400/F57C00/FFFFFF?text=Special+Offer',
            target_type: 'category',
            target_id: '1',
            target_name: 'Electronics',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: false,
            priority: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    async getBanners(filters: BannerFilters): Promise<BannersListResponse> {
        await new Promise(r => setTimeout(r, 500));

        let filtered = [...this.banners];

        if (filters.target_type) {
            filtered = filtered.filter(b => b.target_type === filters.target_type);
        }
        if (filters.target_id) {
            filtered = filtered.filter(b => b.target_id === filters.target_id);
        }
        if (filters.is_active !== undefined) {
            filtered = filtered.filter(b => b.is_active === filters.is_active);
        }

        // Pagination
        const limit = filters.limit || 10;
        const page = filters.page || 1;
        const offset = (page - 1) * limit;
        const paginated = filtered.slice(offset, offset + limit);

        return {
            banners: paginated,
            total: filtered.length,
            page,
            limit
        };
    }

    async getBanner(id: string): Promise<Banner> {
        await new Promise(r => setTimeout(r, 300));
        const banner = this.banners.find(b => b.id === id);
        if (!banner) throw new Error('Banner not found');
        return banner;
    }

    async createBanner(data: CreateBannerDTO): Promise<Banner> {
        await new Promise(r => setTimeout(r, 800));

        const newBanner: Banner = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        this.banners.unshift(newBanner);
        return newBanner;
    }

    async updateBanner(id: string, data: UpdateBannerDTO): Promise<Banner> {
        await new Promise(r => setTimeout(r, 600));

        const index = this.banners.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Banner not found');

        this.banners[index] = {
            ...this.banners[index],
            ...data,
            updated_at: new Date().toISOString()
        };

        return this.banners[index];
    }

    async toggleBannerStatus(id: string, is_active: boolean): Promise<Banner> {
        await new Promise(r => setTimeout(r, 400));

        const index = this.banners.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Banner not found');

        this.banners[index].is_active = is_active;
        this.banners[index].updated_at = new Date().toISOString();

        return this.banners[index];
    }

    async deleteBanner(id: string): Promise<void> {
        await new Promise(r => setTimeout(r, 500));
        this.banners = this.banners.filter(b => b.id !== id);
    }

    async getActiveBanners(query: ActiveBannersQuery): Promise<Banner[]> {
        await new Promise(r => setTimeout(r, 400));

        const now = new Date();
        let active = this.banners.filter(b => {
            if (!b.is_active) return false;

            const start = new Date(b.start_date);
            const end = new Date(b.end_date);
            if (now < start || now > end) return false;

            return true;
        });

        // Filter by target
        if (query.zone_id) {
            active = active.filter(b =>
                b.target_type === 'global' ||
                (b.target_type === 'zone' && b.target_id === query.zone_id)
            );
        }
        if (query.category_id) {
            active = active.filter(b =>
                b.target_type === 'global' ||
                (b.target_type === 'category' && b.target_id === query.category_id)
            );
        }
        if (query.store_id) {
            active = active.filter(b =>
                b.target_type === 'global' ||
                (b.target_type === 'store' && b.target_id === query.store_id)
            );
        }

        // Sort by priority
        active.sort((a, b) => a.priority - b.priority);

        return active;
    }

    async getPresignedUploadUrl(request: PresignedUploadRequest): Promise<PresignedUploadResponse> {
        await new Promise(r => setTimeout(r, 300));

        // Simulate presigned URL generation
        const mockFileUrl = `https://cdn.example.com/banners/${Date.now()}-${request.file_name}`;

        return {
            upload_url: `https://upload.example.com/presigned/${Date.now()}`,
            file_url: mockFileUrl,
            expires_in: 3600,
        };
    }

    async bulkAction(payload: BulkBannerActionPayload): Promise<void> {
        await new Promise(r => setTimeout(r, 800));

        payload.banner_ids.forEach(id => {
            const index = this.banners.findIndex(b => b.id === id);
            if (index !== -1) {
                if (payload.action === 'publish') {
                    this.banners[index].is_active = true;
                } else if (payload.action === 'unpublish') {
                    this.banners[index].is_active = false;
                } else if (payload.action === 'change_priority' && payload.priority !== undefined) {
                    this.banners[index].priority = payload.priority;
                }
                this.banners[index].updated_at = new Date().toISOString();
            }
        });
    }
}

class RealBannerService implements IBannerService {
    async getBanners(filters: BannerFilters): Promise<BannersListResponse> {
        const params = new URLSearchParams();
        if (filters.target_type) params.append('target_type', filters.target_type);
        if (filters.target_id) params.append('target_id', filters.target_id);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.page) params.append('page', filters.page.toString());

        const res = await axios.get(`${API_BASE_URL}/banners?${params}`);
        return res.data;
    }

    async getBanner(id: string): Promise<Banner> {
        const res = await axios.get(`${API_BASE_URL}/banners/${id}`);
        return res.data;
    }

    async createBanner(data: CreateBannerDTO): Promise<Banner> {
        const res = await axios.post(`${API_BASE_URL}/banners`, data);
        return res.data;
    }

    async updateBanner(id: string, data: UpdateBannerDTO): Promise<Banner> {
        const res = await axios.put(`${API_BASE_URL}/banners/${id}`, data);
        return res.data;
    }

    async toggleBannerStatus(id: string, is_active: boolean): Promise<Banner> {
        const res = await axios.patch(`${API_BASE_URL}/banners/${id}/status`, { is_active });
        return res.data;
    }

    async deleteBanner(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/banners/${id}`);
    }

    async getActiveBanners(query: ActiveBannersQuery): Promise<Banner[]> {
        const params = new URLSearchParams();
        if (query.zone_id) params.append('zone_id', query.zone_id);
        if (query.category_id) params.append('category_id', query.category_id);
        if (query.store_id) params.append('store_id', query.store_id);

        const res = await axios.get(`${API_BASE_URL}/banners/active?${params}`);
        return res.data;
    }

    async getPresignedUploadUrl(request: PresignedUploadRequest): Promise<PresignedUploadResponse> {
        const res = await axios.post(`${API_BASE_URL}/upload/presigned`, request);
        return res.data;
    }

    async bulkAction(payload: BulkBannerActionPayload): Promise<void> {
        await axios.post(`${API_BASE_URL}/banners/bulk`, payload);
    }
}

export const bannerService: IBannerService = USE_MOCK ? new MockBannerService() : new RealBannerService();
