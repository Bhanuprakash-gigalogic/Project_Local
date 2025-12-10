import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '../services/banner.service';
import {
    BannerFilters,
    CreateBannerDTO,
    UpdateBannerDTO,
    ActiveBannersQuery,
    PresignedUploadRequest,
    BulkBannerActionPayload,
    Banner
} from '../types/banner';

const QUERY_KEYS = {
    banners: (filters?: BannerFilters) => ['banners', filters] as const,
    banner: (id: string) => ['banner', id] as const,
    activeBanners: (query?: ActiveBannersQuery) => ['banners', 'active', query] as const,
};

// Get banners list
export function useGetBanners(filters: BannerFilters = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.banners(filters),
        queryFn: () => bannerService.getBanners(filters),
    });
}

// Get single banner
export function useGetBanner(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.banner(id),
        queryFn: () => bannerService.getBanner(id),
        enabled: !!id,
    });
}

// Create banner
export function useCreateBanner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBannerDTO) => bannerService.createBanner(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
}

// Update banner
export function useUpdateBanner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBannerDTO }) =>
            bannerService.updateBanner(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.banner(variables.id) });
        },
    });
}

// Toggle banner status with optimistic update
export function useToggleBannerStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
            bannerService.toggleBannerStatus(id, is_active),
        onMutate: async ({ id, is_active }) => {
            await queryClient.cancelQueries({ queryKey: ['banners'] });

            const previousBanners = queryClient.getQueryData(['banners']);

            queryClient.setQueriesData({ queryKey: ['banners'] }, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    banners: old.banners.map((b: Banner) =>
                        b.id === id ? { ...b, is_active } : b
                    ),
                };
            });

            return { previousBanners };
        },
        onError: (err, variables, context) => {
            if (context?.previousBanners) {
                queryClient.setQueryData(['banners'], context.previousBanners);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
}

// Delete banner
export function useDeleteBanner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bannerService.deleteBanner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
}

// Get active banners (buyer app simulation)
export function useGetActiveBanners(query: ActiveBannersQuery = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.activeBanners(query),
        queryFn: () => bannerService.getActiveBanners(query),
    });
}

// Presigned upload
export function usePresignedUpload() {
    return useMutation({
        mutationFn: (request: PresignedUploadRequest) =>
            bannerService.getPresignedUploadUrl(request),
    });
}

// Bulk actions
export function useBulkBannerAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BulkBannerActionPayload) => bannerService.bulkAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
}
