import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    Seller,
    SellerFilters,
    SellersListResponse,
    ZoneSeller,
    ZoneSellersResponse,
    AllocateSellerDTO,
    BulkAllocateSellersDTO,
    RemoveSellerDTO
} from '../types/zone';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

// Mock sellers data
const mockSellers: Seller[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890', is_active: true, created_at: new Date().toISOString() },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', is_active: true, created_at: new Date().toISOString() },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', is_active: true, created_at: new Date().toISOString() },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', phone: '+1234567893', is_active: true, created_at: new Date().toISOString() },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1234567894', is_active: true, created_at: new Date().toISOString() },
];

let mockZoneSellers: Map<string, ZoneSeller[]> = new Map();

// Search sellers
export function useSearchSellers(filters: SellerFilters = {}) {
    return useQuery({
        queryKey: ['sellers', filters],
        queryFn: async (): Promise<SellersListResponse> => {
            if (USE_MOCK) {
                await new Promise(r => setTimeout(r, 400));
                let filtered = [...mockSellers];

                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    filtered = filtered.filter(s =>
                        s.name.toLowerCase().includes(search) ||
                        s.email.toLowerCase().includes(search) ||
                        s.phone.includes(search)
                    );
                }

                if (filters.is_active !== undefined) {
                    filtered = filtered.filter(s => s.is_active === filters.is_active);
                }

                const limit = filters.limit || 10;
                const offset = filters.offset || 0;
                const paginated = filtered.slice(offset, offset + limit);

                return {
                    sellers: paginated,
                    total: filtered.length,
                    limit,
                    offset
                };
            }

            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.offset) params.append('offset', filters.offset.toString());
            if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());

            const res = await axios.get(`${API_BASE_URL}/sellers?${params}`);
            return res.data;
        },
    });
}

// Get zone sellers
export function useGetZoneSellers(zoneId: string) {
    return useQuery({
        queryKey: ['zone-sellers', zoneId],
        queryFn: async (): Promise<ZoneSellersResponse> => {
            if (USE_MOCK) {
                await new Promise(r => setTimeout(r, 300));
                const sellers = mockZoneSellers.get(zoneId) || [];
                return {
                    sellers,
                    total: sellers.length
                };
            }

            const res = await axios.get(`${API_BASE_URL}/zones/${zoneId}/sellers`);
            return res.data;
        },
        enabled: !!zoneId,
    });
}

// Allocate seller to zone
export function useAllocateSellerToZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AllocateSellerDTO) => {
            if (USE_MOCK) {
                await new Promise(r => setTimeout(r, 500));
                const seller = mockSellers.find(s => s.id === data.seller_id);
                if (!seller) throw new Error('Seller not found');

                const zoneSeller: ZoneSeller = {
                    id: Math.random().toString(36).substr(2, 9),
                    zone_id: data.zone_id,
                    seller_id: data.seller_id,
                    seller_name: seller.name,
                    seller_phone: seller.phone,
                    seller_email: seller.email,
                    allocated_at: new Date().toISOString(),
                };

                const existing = mockZoneSellers.get(data.zone_id) || [];
                mockZoneSellers.set(data.zone_id, [...existing, zoneSeller]);
                return;
            }

            await axios.post(`${API_BASE_URL}/zones/${data.zone_id}/sellers`, {
                seller_id: data.seller_id
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['zone-sellers', variables.zone_id] });
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

// Bulk allocate sellers
export function useBulkAllocateSellers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: BulkAllocateSellersDTO) => {
            if (USE_MOCK) {
                await new Promise(r => setTimeout(r, 600));
                const existing = mockZoneSellers.get(data.zone_id) || [];

                const newAllocations = data.seller_ids.map(sellerId => {
                    const seller = mockSellers.find(s => s.id === sellerId);
                    if (!seller) throw new Error(`Seller ${sellerId} not found`);

                    return {
                        id: Math.random().toString(36).substr(2, 9),
                        zone_id: data.zone_id,
                        seller_id: sellerId,
                        seller_name: seller.name,
                        seller_phone: seller.phone,
                        seller_email: seller.email,
                        allocated_at: new Date().toISOString(),
                    };
                });

                mockZoneSellers.set(data.zone_id, [...existing, ...newAllocations]);
                return;
            }

            await axios.post(`${API_BASE_URL}/zones/${data.zone_id}/sellers/bulk`, {
                seller_ids: data.seller_ids
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['zone-sellers', variables.zone_id] });
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

// Remove seller from zone
export function useRemoveSellerFromZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RemoveSellerDTO) => {
            if (USE_MOCK) {
                await new Promise(r => setTimeout(r, 400));
                const existing = mockZoneSellers.get(data.zone_id) || [];
                const filtered = existing.filter(s => s.seller_id !== data.seller_id);
                mockZoneSellers.set(data.zone_id, filtered);
                return;
            }

            await axios.delete(`${API_BASE_URL}/zones/${data.zone_id}/sellers/${data.seller_id}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['zone-sellers', variables.zone_id] });
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

// Bulk remove all sellers from zone
export function useBulkRemoveSellers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (zoneId: string) => {
            if (USE_MOCK) {
                await new Promise(r => setTimeout(r, 500));
                mockZoneSellers.set(zoneId, []);
                return;
            }

            await axios.delete(`${API_BASE_URL}/zones/${zoneId}/sellers`);
        },
        onSuccess: (_, zoneId) => {
            queryClient.invalidateQueries({ queryKey: ['zone-sellers', zoneId] });
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}
