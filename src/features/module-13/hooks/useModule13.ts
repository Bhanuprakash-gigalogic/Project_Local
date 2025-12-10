import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { module13Service } from '../services/module13.service';
import {
    Module13Filters,
    CreateModule13DTO,
    UpdateModule13DTO,
    BulkDeleteModule13Payload
} from '../types/module13';

const QUERY_KEYS = {
    module13: (filters?: Module13Filters) => ['module13', filters] as const,
    module13ById: (id: string) => ['module13', id] as const,
};

// Get module13 list
export function useGetModule13(filters: Module13Filters = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.module13(filters),
        queryFn: () => module13Service.getModule13(filters),
    });
}

// Get single module13
export function useGetModule13ById(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.module13ById(id),
        queryFn: () => module13Service.getModule13ById(id),
        enabled: !!id,
    });
}

// Create module13
export function useCreateModule13() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateModule13DTO) => module13Service.createModule13(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module13'] });
        },
    });
}

// Update module13
export function useUpdateModule13() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateModule13DTO }) =>
            module13Service.updateModule13(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['module13'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.module13ById(variables.id) });
        },
    });
}

// Delete module13
export function useDeleteModule13() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => module13Service.deleteModule13(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module13'] });
        },
    });
}

// Bulk delete module13
export function useBulkDeleteModule13() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BulkDeleteModule13Payload) => module13Service.bulkDeleteModule13(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module13'] });
        },
    });
}

// Export module13
export function useExportModule13() {
    return useMutation({
        mutationFn: (filters: Module13Filters) => module13Service.exportModule13(filters),
        onSuccess: (blob) => {
            // Download the CSV file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `module13-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },
    });
}
