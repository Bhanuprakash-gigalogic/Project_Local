import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

const zoneSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    code: z.string().min(2, 'Code is required'),
    description: z.string().optional(),
});

type ZoneFormInputs = z.infer<typeof zoneSchema>;

interface ZoneStepProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

const ZoneForm: React.FC<ZoneStepProps> = ({ onComplete, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ZoneFormInputs>({
        resolver: zodResolver(zoneSchema),
    });

    const onSubmit = async (data: ZoneFormInputs) => {
        setIsSubmitting(true);
        // Simulate API call with mock polygon data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);

        // Pass mock zone data
        onComplete({
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            polygon: {
                type: 'Polygon',
                coordinates: [[
                    [-74.0060, 40.7128],
                    [-74.0160, 40.7228],
                    [-74.0060, 40.7328],
                    [-74.0060, 40.7128]
                ]]
            },
            storeIds: []
        });
    };

    return (
        <div className="h-full">
            <h3 className="text-lg font-medium mb-4">Create Delivery Zone</h3>
            <p className="text-sm text-gray-500 mb-6">
                Define your first delivery zone. You can configure the geographic boundaries later from the Zones management page.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Zone Name</label>
                    <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border px-3 py-2 ${errors.name ? 'border-red-300' : ''}`}
                        {...register('name')}
                        placeholder="e.g. Downtown Delivery Zone"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Zone Code</label>
                    <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border px-3 py-2 ${errors.code ? 'border-red-300' : ''}`}
                        {...register('code')}
                        placeholder="e.g. DT-01"
                    />
                    {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                    <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border px-3 py-2"
                        {...register('description')}
                        placeholder="Brief description of this zone..."
                    />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> You can define the exact geographic boundaries using the interactive map in the Zones management section after completing this setup.
                    </p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Skip
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                        Create Zone & Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ZoneForm;
