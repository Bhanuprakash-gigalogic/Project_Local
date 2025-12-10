import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { sellerAllocationService } from '../services/sellerAllocation.service';
import { AllocationProgress, AllocationError } from '../types/sellerAllocation';

const QUERY_KEYS = {
    searchSellers: (query: string) => ['sellers', 'search', query] as const,
    storeSellers: (storeId: string, page?: number) => ['stores', storeId, 'sellers', page] as const,
};

// Debounced search sellers
export function useSearchSellers(query: string, debounceMs = 300) {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs]);

    return useQuery({
        queryKey: QUERY_KEYS.searchSellers(debouncedQuery),
        queryFn: () => sellerAllocationService.searchSellers(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
    });
}

// Get store's allocated sellers
export function useGetStoreSellers(storeId: string, page = 1, limit = 10) {
    return useQuery({
        queryKey: QUERY_KEYS.storeSellers(storeId, page),
        queryFn: () => sellerAllocationService.getStoreSellers(storeId, page, limit),
        enabled: !!storeId,
    });
}

// Allocate single seller
export function useAllocateSeller(storeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sellerId: string) => sellerAllocationService.allocateSeller(storeId, sellerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores', storeId, 'sellers'] });
            queryClient.invalidateQueries({ queryKey: ['stores'] }); // Update store metrics
        },
    });
}

// Bulk allocate sellers with progress tracking
export function useBulkAllocateSellers(storeId: string) {
    const [progress, setProgress] = useState<AllocationProgress>({
        total: 0,
        completed: 0,
        successful: 0,
        failed: 0,
        errors: [],
    });
    const [isAllocating, setIsAllocating] = useState(false);
    const queryClient = useQueryClient();

    const allocate = async (sellerIds: string[], sellerNames: Map<string, string>) => {
        setIsAllocating(true);
        setProgress({
            total: sellerIds.length,
            completed: 0,
            successful: 0,
            failed: 0,
            errors: [],
        });

        const errors: AllocationError[] = [];
        let successful = 0;

        for (let i = 0; i < sellerIds.length; i++) {
            const sellerId = sellerIds[i];
            const sellerName = sellerNames.get(sellerId) || 'Unknown';

            try {
                await sellerAllocationService.allocateSeller(storeId, sellerId);
                successful++;
            } catch (error: any) {
                const errorMessage = error.message || 'Unknown error';
                let errorCode: AllocationError['error_code'] = 'UNKNOWN_ERROR';

                if (errorMessage.includes('SELLER_ALREADY_ALLOCATED')) {
                    errorCode = 'SELLER_ALREADY_ALLOCATED';
                } else if (errorMessage.includes('SELLER_NOT_FOUND')) {
                    errorCode = 'SELLER_NOT_FOUND';
                }

                errors.push({
                    seller_id: sellerId,
                    seller_name: sellerName,
                    error_code: errorCode,
                    message: errorMessage,
                });
            }

            setProgress({
                total: sellerIds.length,
                completed: i + 1,
                successful,
                failed: errors.length,
                errors,
            });
        }

        setIsAllocating(false);

        // Invalidate queries after completion
        queryClient.invalidateQueries({ queryKey: ['stores', storeId, 'sellers'] });
        queryClient.invalidateQueries({ queryKey: ['stores'] });

        return { successful, failed: errors.length, errors };
    };

    return {
        allocate,
        progress,
        isAllocating,
        resetProgress: () => setProgress({
            total: 0,
            completed: 0,
            successful: 0,
            failed: 0,
            errors: [],
        }),
    };
}

// Remove seller from store
export function useRemoveSeller(storeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sellerId: string) => sellerAllocationService.removeSeller(storeId, sellerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores', storeId, 'sellers'] });
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
    });
}

// Remove all sellers from store
export function useRemoveAllSellers(storeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => sellerAllocationService.removeAllSellers(storeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores', storeId, 'sellers'] });
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
    });
}
