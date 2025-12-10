import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zoneService } from '../services/zone.service';
import { CreateZoneDTO, UpdateZoneDTO } from '../types/zone';

export const useGetZones = (page: number, limit: number, search?: string, status?: string) => {
    return useQuery({
        queryKey: ['zones', page, limit, search, status],
        queryFn: () => zoneService.getZones({
            offset: (page - 1) * limit,
            limit,
            search,
            is_active: status ? status === 'active' : undefined
        }),
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
        mutationFn: ({ id, data }: { id: string; data: UpdateZoneDTO }) => zoneService.updateZone(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
            queryClient.invalidateQueries({ queryKey: ['zones', data.id] });
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
