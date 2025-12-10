import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Banner, CreateBannerDTO, UpdateBannerDTO } from '../types/banner';
import { usePresignedUpload } from '../hooks/useBanners';
import { useGetZones } from '../../zones/hooks/useZones';
import { useGetCategories } from '../../categories/hooks/useCategories';
import { useGetStores } from '../../stores/hooks/useStores';

const bannerSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    desktop_image_url: z.string().url('Must be a valid URL'),
    mobile_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    target_type: z.enum(['global', 'zone', 'category', 'store']),
    target_id: z.string().optional(),
    click_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    start_date: z.string(),
    end_date: z.string(),
    is_active: z.boolean(),
    priority: z.number().min(0),
});

type BannerFormInputs = z.infer<typeof bannerSchema>;

interface BannerFormProps {
    banner?: Banner;
    onSubmit: (data: CreateBannerDTO | UpdateBannerDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const BannerForm: React.FC<BannerFormProps> = ({ banner, onSubmit, onCancel, isLoading }) => {
    const [uploadingDesktop, setUploadingDesktop] = useState(false);
    const [uploadingMobile, setUploadingMobile] = useState(false);

    const { data: zonesData } = useGetZones({ limit: 100 });
    const { data: categoriesData } = useGetCategories({});
    const { data: storesData } = useGetStores({ limit: 100 });
    const presignedMutation = usePresignedUpload();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BannerFormInputs>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            title: banner?.title || '',
            desktop_image_url: banner?.desktop_image_url || '',
            mobile_image_url: banner?.mobile_image_url || '',
            target_type: banner?.target_type || 'global',
            target_id: banner?.target_id || '',
            click_url: banner?.click_url || '',
            start_date: banner?.start_date ? banner.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
            end_date: banner?.end_date ? banner.end_date.split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            is_active: banner?.is_active ?? true,
            priority: banner?.priority ?? 1,
        },
    });

    const targetType = watch('target_type');

    const handleImageUpload = async (file: File, type: 'desktop' | 'mobile') => {
        try {
            if (type === 'desktop') setUploadingDesktop(true);
            else setUploadingMobile(true);

            // Get presigned URL
            const presignedData = await presignedMutation.mutateAsync({
                file_name: file.name,
                file_type: file.type,
            });

            // In real implementation, upload to presigned URL
            // await fetch(presignedData.upload_url, { method: 'PUT', body: file });

            // Set the file URL in form
            if (type === 'desktop') {
                setValue('desktop_image_url', presignedData.file_url);
            } else {
                setValue('mobile_image_url', presignedData.file_url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            if (type === 'desktop') setUploadingDesktop(false);
            else setUploadingMobile(false);
        }
    };

    const handleFormSubmit = async (data: BannerFormInputs) => {
        const payload: CreateBannerDTO | UpdateBannerDTO = {
            title: data.title,
            desktop_image_url: data.desktop_image_url,
            mobile_image_url: data.mobile_image_url || undefined,
            target_type: data.target_type,
            target_id: data.target_type === 'global' ? undefined : data.target_id,
            click_url: data.click_url || undefined,
            start_date: new Date(data.start_date).toISOString(),
            end_date: new Date(data.end_date).toISOString(),
            is_active: data.is_active,
            priority: data.priority,
        };

        await onSubmit(payload);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">
                    {banner ? 'Edit Banner' : 'Create New Banner'}
                </h2>
                <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                        {...register('title')}
                        placeholder="e.g. Summer Sale 2024"
                    />
                    {errors.title && (
                        <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
                    )}
                </div>

                {/* Desktop Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Desktop Image * (1200x400 recommended)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, 'desktop');
                            }}
                            className="hidden"
                            id="desktop-upload"
                        />
                        <label
                            htmlFor="desktop-upload"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary"
                        >
                            {uploadingDesktop ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <Upload size={16} />
                            )}
                            <span className="text-sm">Upload Desktop Image</span>
                        </label>
                    </div>
                    {watch('desktop_image_url') && (
                        <div className="mt-2">
                            <img
                                src={watch('desktop_image_url')}
                                alt="Desktop preview"
                                className="w-full h-32 object-cover rounded border"
                            />
                        </div>
                    )}
                    {errors.desktop_image_url && (
                        <p className="mt-1 text-xs text-red-600">{errors.desktop_image_url.message}</p>
                    )}
                </div>

                {/* Mobile Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Image (600x300 recommended)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, 'mobile');
                            }}
                            className="hidden"
                            id="mobile-upload"
                        />
                        <label
                            htmlFor="mobile-upload"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary"
                        >
                            {uploadingMobile ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <Upload size={16} />
                            )}
                            <span className="text-sm">Upload Mobile Image</span>
                        </label>
                    </div>
                    {watch('mobile_image_url') && (
                        <div className="mt-2">
                            <img
                                src={watch('mobile_image_url')}
                                alt="Mobile preview"
                                className="w-full h-24 object-cover rounded border"
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Type *
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...register('target_type')}
                        >
                            <option value="global">Global</option>
                            <option value="zone">Zone</option>
                            <option value="category">Category</option>
                            <option value="store">Store</option>
                        </select>
                    </div>

                    {targetType !== 'global' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target {targetType.charAt(0).toUpperCase() + targetType.slice(1)}
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                {...register('target_id')}
                            >
                                <option value="">Select...</option>
                                {targetType === 'zone' && zonesData?.zones.map(z => (
                                    <option key={z.id} value={z.id}>{z.name}</option>
                                ))}
                                {targetType === 'category' && categoriesData?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                                {targetType === 'store' && storesData?.stores.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Click URL
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register('click_url')}
                        placeholder="https://example.com/sale"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date *
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...register('start_date')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date *
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...register('end_date')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...register('priority', { valueAsNumber: true })}
                            min="0"
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
                        disabled={isLoading || uploadingDesktop || uploadingMobile}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                        {banner ? 'Update Banner' : 'Create Banner'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BannerForm;
