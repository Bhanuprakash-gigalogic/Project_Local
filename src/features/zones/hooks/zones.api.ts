import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zoneService } from '../services/zones.service';
import {
    BulkActionPayload,
    CreateZoneDTO,
    UpdateZoneDTO,
    ZoneFilters
} from '../types/zones.types';

export const useGetZones = (filters: ZoneFilters) => {
    return useQuery({
        queryKey: ['zones', filters],
        queryFn: () => zoneService.getZones(
            filters.page,
            filters.limit,
            filters.search,
            filters.status
        ),
        placeholderData: (prev) => prev
    });
};

export const useGetZoneById = (id: string, enabled = true) => {
    return useQuery({
        queryKey: ['zones', id],
        queryFn: () => zoneService.getZoneById(id),
        enabled
    });
};

export const useCreateZone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateZoneDTO) => zoneService.createZone(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        }
    });
};

export const useUpdateZone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateZoneDTO) => zoneService.updateZone(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
            queryClient.invalidateQueries({ queryKey: ['zones', data.id] });
        }
    });
};

export const useDeleteZone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => zoneService.deleteZone(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        }
    });
};

export const useBulkZonesAction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: BulkActionPayload) => zoneService.bulkAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        }
    });
};

export const useLocateZone = (lat?: number, lng?: number) => {
    return useQuery({
        queryKey: ['locate-zone', lat, lng],
        queryFn: () => zoneService.locateZone(lat!, lng!),
        enabled: !!lat && !!lng
    });
};

export const useGetStoresForSelect = (search: string) => {
    return useQuery({
        queryKey: ['stores', search],
        queryFn: () => zoneService.getStores(search)
    });
};
