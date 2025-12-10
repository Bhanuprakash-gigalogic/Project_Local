import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { Store, CreateStoreDTO, UpdateStoreDTO } from '../types/store';
import { useGetZones } from '../../zones/hooks/useZones';

const storeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    zone_id: z.string().min(1, 'Zone is required'),
    description: z.string().optional(),
    address: z.string().min(5, 'Address is required'),
    contact: z.string().optional(),
    is_active: z.boolean(),
});

type StoreFormInputs = z.infer<typeof storeSchema>;

interface StoreFormProps {
    store?: Store;
    onSubmit: (data: CreateStoreDTO | UpdateStoreDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({ store, onSubmit, onCancel, isLoading }) => {
    const { data: zonesData, isLoading: zonesLoading } = useGetZones({ limit: 100 });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StoreFormInputs>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: store?.name || '',
            zone_id: store?.zone_id || '',
            description: store?.description || '',
            address: store?.address || '',
            contact: store?.contact || '',
            is_active: store?.is_active ?? true,
        },
    });

    const handleFormSubmit = async (data: StoreFormInputs) => {
        const payload: CreateStoreDTO | UpdateStoreDTO = {
            name: data.name,
            zone_id: data.zone_id,
            description: data.description,
            address: data.address,
            contact: data.contact,
            is_active: data.is_active,
        };

        await onSubmit(payload);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">
                    {store ? 'Edit Store' : 'Create New Store'}
                </h2>
                <button
                    onClick={onCancel}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Name *
                    </label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                        {...register('name')}
                        placeholder="e.g. Downtown Store"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zone *
                    </label>
                    <select
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.zone_id ? 'border-red-300' : 'border-gray-300'
                            }`}
                        {...register('zone_id')}
                        disabled={zonesLoading}
                    >
                        <option value="">Select a zone...</option>
                        {zonesData?.zones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                                {zone.name} ({zone.city})
                            </option>
                        ))}
                    </select>
                    {errors.zone_id && (
                        <p className="mt-1 text-xs text-red-600">{errors.zone_id.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                    </label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.address ? 'border-red-300' : 'border-gray-300'
                            }`}
                        {...register('address')}
                        placeholder="e.g. 123 Main St, New York, NY 10001"
                    />
                    {errors.address && (
                        <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register('contact')}
                        placeholder="e.g. +1-555-0101"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register('description')}
                        placeholder="Brief description of this store..."
                    />
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
                        disabled={isLoading || zonesLoading}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                        {store ? 'Update Store' : 'Create Store'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreForm;
