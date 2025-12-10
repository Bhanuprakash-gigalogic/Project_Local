import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zoneService } from '../services/zone.service';
import {
    Zone,
    ZoneFilters,
    CreateZoneDTO,
    UpdateZoneDTO,
    LocateRequest,
    BulkActionPayload
} from '../types/zone';

const QUERY_KEYS = {
    zones: (filters?: ZoneFilters) => ['zones', filters] as const,
    zone: (id: string) => ['zone', id] as const,
};

// Get zones list with filters
export function useGetZones(filters: ZoneFilters = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.zones(filters),
        queryFn: () => zoneService.getZones(filters),
    });
}

// Get single zone
export function useGetZone(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.zone(id),
        queryFn: () => zoneService.getZone(id),
        enabled: !!id,
    });
}

// Create zone
export function useCreateZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateZoneDTO) => zoneService.createZone(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

// Update zone
export function useUpdateZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateZoneDTO }) =>
            zoneService.updateZone(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zone(variables.id) });
        },
    });
}

// Delete zone
export function useDeleteZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => zoneService.deleteZone(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

// Restore zone
export function useRestoreZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => zoneService.restoreZone(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zone(id) });
        },
    });
}

// Locate zone by coordinates
export function useLocateZone() {
    return useMutation({
        mutationFn: (request: LocateRequest) => zoneService.locateZone(request),
    });
}

// Bulk actions
export function useBulkAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BulkActionPayload) => zoneService.bulkAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

// Toggle zone active status with optimistic update
export function useToggleZoneActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
            zoneService.updateZone(id, { is_active }),
        onMutate: async ({ id, is_active }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['zones'] });

            // Snapshot previous value
            const previousZones = queryClient.getQueryData(['zones']);

            // Optimistically update
            queryClient.setQueriesData({ queryKey: ['zones'] }, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    zones: old.zones.map((z: Zone) =>
                        z.id === id ? { ...z, is_active } : z
                    ),
                };
            });

            return { previousZones };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousZones) {
                queryClient.setQueryData(['zones'], context.previousZones);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

// Get zone allocations
export function useGetZoneAllocations(zoneId: string) {
    return useQuery({
        queryKey: ['zone-allocations', zoneId],
        queryFn: () => zoneService.getZoneAllocations(zoneId),
        enabled: !!zoneId,
    });
}

// Allocate sellers to zone
export function useAllocateToZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { zone_id: string; seller_ids: string[] }) =>
            zoneService.allocateToZone(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['zone-allocations', variables.zone_id] });
        },
    });
}

// Remove allocation
export function useRemoveAllocation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { zone_id: string; allocation_id: string }) =>
            zoneService.removeAllocation(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['zone-allocations', variables.zone_id] });
        },
    });
}
