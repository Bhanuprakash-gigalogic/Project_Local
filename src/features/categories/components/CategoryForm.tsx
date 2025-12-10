import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category';
import { useGetCategoryTree } from '../hooks/useCategories';

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug is required'),
    parent_id: z.string().nullable(),
    icon_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    banner_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    description: z.string().optional(),
    is_active: z.boolean(),
    sort_order: z.number().min(0).optional(),
});

type CategoryFormInputs = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    category?: Category;
    onSubmit: (data: CreateCategoryDTO | UpdateCategoryDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel, isLoading }) => {
    const { data: treeData } = useGetCategoryTree();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CategoryFormInputs>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name || '',
            slug: category?.slug || '',
            parent_id: category?.parent_id || null,
            icon_url: category?.icon_url || '',
            banner_url: category?.banner_url || '',
            description: category?.description || '',
            is_active: category?.is_active ?? true,
            sort_order: category?.sort_order ?? 0,
        },
    });

    const name = watch('name');

    // Auto-generate slug from name
    useEffect(() => {
        if (!category && name) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setValue('slug', slug);
        }
    }, [name, category, setValue]);

    const handleFormSubmit = async (data: CategoryFormInputs) => {
        const payload: CreateCategoryDTO | UpdateCategoryDTO = {
            name: data.name,
            slug: data.slug,
            parent_id: data.parent_id || null,
            icon_url: data.icon_url || undefined,
            banner_url: data.banner_url || undefined,
            description: data.description,
            is_active: data.is_active,
            sort_order: data.sort_order,
        };

        await onSubmit(payload);
    };

    // Flatten tree for parent selection
    const flattenTree = (nodes: any[], level = 0): any[] => {
        let result: any[] = [];
        nodes.forEach(node => {
            result.push({ ...node, level });
            if (node.children && node.children.length > 0) {
                result = result.concat(flattenTree(node.children, level + 1));
            }
        });
        return result;
    };

    const flatCategories = treeData ? flattenTree(treeData.categories) : [];

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">
                    {category ? 'Edit Category' : 'Create New Category'}
                </h2>
                <button
                    onClick={onCancel}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                            {...register('name')}
                            placeholder="e.g. Electronics"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug *
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.slug ? 'border-red-300' : 'border-gray-300'
                                }`}
                            {...register('slug')}
                            placeholder="e.g. electronics"
                        />
                        {errors.slug && (
                            <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Category
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register('parent_id')}
                    >
                        <option value="">None (Root Category)</option>
                        {flatCategories
                            .filter(c => c.id !== category?.id) // Prevent selecting self
                            .map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {'  '.repeat(cat.level)}└─ {cat.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon URL
                    </label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.icon_url ? 'border-red-300' : 'border-gray-300'
                            }`}
                        {...register('icon_url')}
                        placeholder="https://example.com/icon.png"
                    />
                    {errors.icon_url && (
                        <p className="mt-1 text-xs text-red-600">{errors.icon_url.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banner URL
                    </label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.banner_url ? 'border-red-300' : 'border-gray-300'
                            }`}
                        {...register('banner_url')}
                        placeholder="https://example.com/banner.png"
                    />
                    {errors.banner_url && (
                        <p className="mt-1 text-xs text-red-600">{errors.banner_url.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register('description')}
                        placeholder="Brief description..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort Order
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...register('sort_order', { valueAsNumber: true })}
                            placeholder="0"
                        />
                    </div>

                    <div className="flex items-center pt-6">
                        <input
                            type="checkbox"
                            id="is_active"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            {...register('is_active')}
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                            Active
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                        {category ? 'Update Category' : 'Create Category'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
