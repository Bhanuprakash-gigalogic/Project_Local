import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useGetZones } from '../../zones/hooks/zones.api';

const storeSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    address: z.string().min(5, 'Address is required'),
    zoneId: z.string().min(1, 'Zone is required'),
});

type StoreFormInputs = z.infer<typeof storeSchema>;

interface StoreStepProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

const StoreForm: React.FC<StoreStepProps> = ({ onComplete, onCancel }) => {
    const { data: zonesData } = useGetZones({ limit: 100 }); // Fetch all zones for select
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StoreFormInputs>({
        resolver: zodResolver(storeSchema),
    });

    const onSubmit = async (data: StoreFormInputs) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        onComplete({ ...data, id: Math.random().toString(36).substr(2, 9) });
    };

    return (
        <div className="h-full">
            <h3 className="text-lg font-medium mb-4">Create Store</h3>
            <p className="text-sm text-gray-500 mb-6">
                Set up a store location and assign it to a delivery zone.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Store Name</label>
                    <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border px-3 py-2 ${errors.name ? 'border-red-300' : ''}`}
                        {...register('name')}
                        placeholder="e.g. Downtown Flagship"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        rows={3}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border px-3 py-2 ${errors.address ? 'border-red-300' : ''}`}
                        {...register('address')}
                        placeholder="Full street address..."
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned Zone</label>
                    <select
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border px-3 py-2 bg-white ${errors.zoneId ? 'border-red-300' : ''}`}
                        {...register('zoneId')}
                    >
                        <option value="">Select a zone</option>
                        {zonesData?.zones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                                {zone.name}
                            </option>
                        ))}
                    </select>
                    {errors.zoneId && <p className="mt-1 text-xs text-red-600">{errors.zoneId.message}</p>}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                        Save Store
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreForm;
