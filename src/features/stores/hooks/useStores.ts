import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../services/store.service';
import {
    Store,
    StoreFilters,
    CreateStoreDTO,
    UpdateStoreDTO,
    BulkStoreActionPayload
} from '../types/store';

const QUERY_KEYS = {
    stores: (filters?: StoreFilters) => ['stores', filters] as const,
    store: (id: string) => ['store', id] as const,
};

// Get stores list with filters
export function useGetStores(filters: StoreFilters = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.stores(filters),
        queryFn: () => storeService.getStores(filters),
    });
}

// Get single store
export function useGetStore(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.store(id),
        queryFn: () => storeService.getStore(id),
        enabled: !!id,
    });
}

// Create store
export function useCreateStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStoreDTO) => storeService.createStore(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
    });
}

// Update store
export function useUpdateStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStoreDTO }) =>
            storeService.updateStore(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store(variables.id) });
        },
    });
}

// Delete store
export function useDeleteStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => storeService.deleteStore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
    });
}

// Restore store
export function useRestoreStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => storeService.restoreStore(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store(id) });
        },
    });
}

// Bulk actions
export function useBulkStoreAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BulkStoreActionPayload) => storeService.bulkAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
    });
}

// Toggle store active status with optimistic update
export function useToggleStoreActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
            storeService.updateStore(id, { is_active }),
        onMutate: async ({ id, is_active }) => {
            await queryClient.cancelQueries({ queryKey: ['stores'] });

            const previousStores = queryClient.getQueryData(['stores']);

            queryClient.setQueriesData({ queryKey: ['stores'] }, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    stores: old.stores.map((s: Store) =>
                        s.id === id ? { ...s, is_active } : s
                    ),
                };
            });

            return { previousStores };
        },
        onError: (err, variables, context) => {
            if (context?.previousStores) {
                queryClient.setQueryData(['stores'], context.previousStores);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
    });
}
