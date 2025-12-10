import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetBanner, useDeleteBanner, useToggleBannerStatus, useUpdateBanner } from '../hooks/useBanners';
import BannerForm from '../components/BannerForm';
import { ArrowLeft, Edit2, Trash2, Loader2, Calendar, Target, Link as LinkIcon, Hash } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { UpdateBannerDTO } from '../types/banner';

const BannerDetail: React.FC = () => {
    const { bannerId } = useParams<{ bannerId: string }>();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: banner, isLoading } = useGetBanner(bannerId!);
    const deleteMutation = useDeleteBanner();
    const toggleStatusMutation = useToggleBannerStatus();
    const updateMutation = useUpdateBanner();

    const handleDelete = async () => {
        if (!confirm('Delete this banner?')) return;
        await deleteMutation.mutateAsync(bannerId!);
        navigate('/admin/banners');
    };

    const handleToggleStatus = async () => {
        if (!banner) return;
        await toggleStatusMutation.mutateAsync({ id: banner.id, is_active: !banner.is_active });
    };

    const handleUpdate = async (data: UpdateBannerDTO) => {
        await updateMutation.mutateAsync({ id: bannerId!, data });
        setIsEditOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!banner) {
        return (
            <div className="p-6">
                <p className="text-gray-600">Banner not found</p>
            </div>
        );
    }

    const isActive = banner.is_active;
    const now = new Date();
    const startDate = new Date(banner.start_date);
    const endDate = new Date(banner.end_date);
    const isLive = isActive && now >= startDate && now <= endDate;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/banners')}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{banner.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${banner.is_active
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {banner.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {isLive && (
                                <span className="text-xs px-2 py-1 bg-green-600 text-white rounded font-medium">
                                    LIVE
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <Edit2 size={16} className="-ml-1 mr-2" />
                        Edit
                    </button>
                    <button
                        onClick={handleToggleStatus}
                        disabled={toggleStatusMutation.isPending}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${banner.is_active
                                ? 'text-orange-700 bg-orange-100 border border-orange-300 hover:bg-orange-200'
                                : 'text-green-700 bg-green-100 border border-green-300 hover:bg-green-200'
                            }`}
                    >
                        {banner.is_active ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200"
                    >
                        <Trash2 size={16} className="-ml-1 mr-2" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Images */}
            <div className="bg-white border rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Banner Images</h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Desktop Image</p>
                        <img
                            src={banner.desktop_image_url}
                            alt="Desktop banner"
                            className="w-full rounded border"
                        />
                    </div>
                    {banner.mobile_image_url && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Mobile Image</p>
                            <img
                                src={banner.mobile_image_url}
                                alt="Mobile banner"
                                className="w-full max-w-md rounded border"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="bg-white border rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Banner Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Target size={14} />
                            <span className="font-medium">Target Type</span>
                        </div>
                        <p className="text-gray-900 capitalize">{banner.target_type}</p>
                        {banner.target_name && (
                            <p className="text-sm text-gray-500 mt-1">{banner.target_name}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Hash size={14} />
                            <span className="font-medium">Priority</span>
                        </div>
                        <p className="text-gray-900">{banner.priority}</p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Calendar size={14} />
                            <span className="font-medium">Start Date</span>
                        </div>
                        <p className="text-gray-900">{new Date(banner.start_date).toLocaleString()}</p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Calendar size={14} />
                            <span className="font-medium">End Date</span>
                        </div>
                        <p className="text-gray-900">{new Date(banner.end_date).toLocaleString()}</p>
                    </div>

                    {banner.click_url && (
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <LinkIcon size={14} />
                                <span className="font-medium">Click URL</span>
                            </div>
                            <a
                                href={banner.click_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline break-all"
                            >
                                {banner.click_url}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50">
                        <BannerForm
                            banner={banner}
                            onSubmit={handleUpdate}
                            onCancel={() => setIsEditOpen(false)}
                            isLoading={updateMutation.isPending}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default BannerDetail;
