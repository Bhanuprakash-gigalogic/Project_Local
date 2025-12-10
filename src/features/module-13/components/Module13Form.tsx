import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { Module13, CreateModule13DTO, UpdateModule13DTO } from '../types/module13';

const module13Schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: z.string().optional(),
    is_active: z.boolean(),
    metadata: z.string().optional().refine((val) => {
        if (!val || val.trim() === '') return true;
        try {
            JSON.parse(val);
            return true;
        } catch {
            return false;
        }
    }, 'Metadata must be valid JSON'),
});

type Module13FormInputs = z.infer<typeof module13Schema>;

interface Module13FormProps {
    module13?: Module13;
    onSubmit: (data: CreateModule13DTO | UpdateModule13DTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const Module13Form: React.FC<Module13FormProps> = ({ module13, onSubmit, onCancel, isLoading }) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Module13FormInputs>({
        resolver: zodResolver(module13Schema),
        defaultValues: {
            name: module13?.name || '',
            slug: module13?.slug || '',
            description: module13?.description || '',
            is_active: module13?.is_active ?? true,
            metadata: module13?.metadata ? JSON.stringify(module13.metadata, null, 2) : '',
        },
    });

    const nameValue = watch('name');

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        if (!module13) { // Only auto-generate for new items
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            setValue('slug', slug);
        }
    };

    const handleFormSubmit = async (data: Module13FormInputs) => {
        try {
            setServerError(null);

            const payload: CreateModule13DTO | UpdateModule13DTO = {
                name: data.name,
                slug: data.slug,
                description: data.description || undefined,
                is_active: data.is_active,
                metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
            };

            await onSubmit(payload);
        } catch (error: any) {
            setServerError(error.message || 'An error occurred');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">
                    {module13 ? 'Edit Inventory Item' : 'Create New Inventory Item'}
                </h2>
                <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
                {serverError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{serverError}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                        {...register('name', {
                            onChange: handleNameChange
                        })}
                        placeholder="e.g. Widget A"
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
                        placeholder="e.g. widget-a"
                    />
                    {errors.slug && (
                        <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        {...register('description')}
                        placeholder="Optional description..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metadata (JSON)
                    </label>
                    <textarea
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm ${errors.metadata ? 'border-red-300' : 'border-gray-300'
                            }`}
                        rows={4}
                        {...register('metadata')}
                        placeholder='{"key": "value"}'
                    />
                    {errors.metadata && (
                        <p className="mt-1 text-xs text-red-600">{errors.metadata.message}</p>
                    )}
                </div>

                <div className="flex items-center">
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
                        {module13 ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Module13Form;
