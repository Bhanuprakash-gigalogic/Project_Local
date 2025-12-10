import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import {
    CreateCategoryDTO,
    UpdateCategoryDTO,
    ReorderCategoryDTO,
    CategoryFilters
} from '../types/category';

const QUERY_KEYS = {
    tree: (zoneId?: string) => ['categories', 'tree', zoneId] as const,
    categories: (filters?: CategoryFilters) => ['categories', 'list', filters] as const,
    category: (id: string) => ['category', id] as const,
};

// Get category tree
export function useGetCategoryTree(zoneId?: string) {
    return useQuery({
        queryKey: QUERY_KEYS.tree(zoneId),
        queryFn: () => categoryService.getCategoryTree(zoneId),
    });
}

// Get categories list
export function useGetCategories(filters: CategoryFilters = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.categories(filters),
        queryFn: () => categoryService.getCategories(filters),
    });
}

// Get single category
export function useGetCategory(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.category(id),
        queryFn: () => categoryService.getCategory(id),
        enabled: !!id,
    });
}

// Create category
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryDTO) => categoryService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}

// Update category
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDTO }) =>
            categoryService.updateCategory(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.category(variables.id) });
        },
    });
}

// Reorder category
export function useReorderCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReorderCategoryDTO }) =>
            categoryService.reorderCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}

// Delete category (with safety checks)
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => categoryService.deleteCategory(id),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            }
        },
    });
}
