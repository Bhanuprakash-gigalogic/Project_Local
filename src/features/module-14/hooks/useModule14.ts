import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { module14Service } from '../services/module14.service';
import {
    Module14Filters,
    CreateModule14DTO,
    UpdateModule14DTO,
    BulkDeleteModule14Payload
} from '../types/module14';

const QUERY_KEYS = {
    module14: (filters?: Module14Filters) => ['module14', filters] as const,
    module14ById: (id: string) => ['module14', id] as const,
};

// Get module14 list
export function useGetModule14(filters: Module14Filters = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.module14(filters),
        queryFn: () => module14Service.getModule14(filters),
    });
}

// Get single module14
export function useGetModule14ById(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.module14ById(id),
        queryFn: () => module14Service.getModule14ById(id),
        enabled: !!id,
    });
}

// Create module14
export function useCreateModule14() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateModule14DTO) => module14Service.createModule14(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module14'] });
        },
    });
}

// Update module14
export function useUpdateModule14() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateModule14DTO }) =>
            module14Service.updateModule14(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['module14'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.module14ById(variables.id) });
        },
    });
}

// Delete module14
export function useDeleteModule14() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => module14Service.deleteModule14(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module14'] });
        },
    });
}

// Bulk delete module14
export function useBulkDeleteModule14() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BulkDeleteModule14Payload) => module14Service.bulkDeleteModule14(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module14'] });
        },
    });
}

// Export module14
export function useExportModule14() {
    return useMutation({
        mutationFn: (filters: Module14Filters) => module14Service.exportModule14(filters),
        onSuccess: (blob) => {
            // Download the CSV file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `module14-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },
    });
}
