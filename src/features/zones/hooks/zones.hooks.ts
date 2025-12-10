import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zoneService } from '../services/zones.service';
import { CreateZoneDTO, UpdateZoneDTO } from '../types/zones.types';

export const useGetZones = (page: number, limit: number, search?: string, status?: string) => {
    return useQuery({
        queryKey: ['zones', page, limit, search, status],
        queryFn: () => zoneService.getZones(page, limit, search, status),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new to avoid flicker
    });
};

export const useCreateZone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateZoneDTO) => zoneService.createZone(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
};

export const useUpdateZone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateZoneDTO) => zoneService.updateZone(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
};

export const useDeleteZone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => zoneService.deleteZone(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
};
