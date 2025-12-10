import React, { useState } from 'react';
import { useGetBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useToggleBannerStatus, useBulkBannerAction, useGetActiveBanners } from '../hooks/useBanners';
import { Banner, CreateBannerDTO, UpdateBannerDTO, BannerFilters } from '../types/banner';
import BannerCard from '../components/BannerCard';
import BannerForm from '../components/BannerForm';
import { Plus, Loader2, Filter, X, TestTube } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useGetZones } from '../../zones/hooks/useZones';

const BannersList: React.FC = () => {
    const [filters, setFilters] = useState<BannerFilters>({ limit: 12, page: 1 });
    const [targetTypeFilter, setTargetTypeFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | undefined>();
    const [selectedBanners, setSelectedBanners] = useState<Set<string>>(new Set());
    const [showTester, setShowTester] = useState(false);
    const [testerZoneId, setTesterZoneId] = useState('');

    const { data, isLoading, refetch } = useGetBanners(filters);
    const { data: zonesData } = useGetZones({ limit: 100 });
    const { data: activeBannersData, isLoading: isLoadingActive } = useGetActiveBanners(
        showTester ? { zone_id: testerZoneId || undefined } : {}
    );
    const createMutation = useCreateBanner();
    const updateMutation = useUpdateBanner();
    const deleteMutation = useDeleteBanner();
    const toggleStatusMutation = useToggleBannerStatus();
    const bulkActionMutation = useBulkBannerAction();

    const handleApplyFilters = () => {
        setFilters(prev => ({
            ...prev,
            target_type: targetTypeFilter as any || undefined,
            is_active: activeFilter,
            page: 1,
        }));
    };

    const handleClearFilters = () => {
        setTargetTypeFilter('');
        setActiveFilter(undefined);
        setFilters({ limit: 12, page: 1 });
    };

    const handleCreate = async (formData: CreateBannerDTO | UpdateBannerDTO) => {
        await createMutation.mutateAsync(formData as CreateBannerDTO);
        setIsFormOpen(false);
    };

    const handleUpdate = async (formData: CreateBannerDTO | UpdateBannerDTO) => {
        if (!editingBanner) return;
        await updateMutation.mutateAsync({ id: editingBanner.id, data: formData as UpdateBannerDTO });
        setEditingBanner(undefined);
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this banner?')) return;
        await deleteMutation.mutateAsync(id);
    };

    const handleToggleStatus = async (id: string, isActive: boolean) => {
        await toggleStatusMutation.mutateAsync({ id, is_active: isActive });
    };

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setIsFormOpen(true);
    };

    const handleDuplicate = (banner: Banner) => {
        setEditingBanner(undefined);
        setIsFormOpen(true);
        // Pre-fill form with banner data (handled in form defaults)
    };

    const handleBulkAction = async (action: 'publish' | 'unpublish' | 'change_priority', priority?: number) => {
        if (selectedBanners.size === 0) return;

        await bulkActionMutation.mutateAsync({
            banner_ids: Array.from(selectedBanners),
            action,
            priority,
        });

        setSelectedBanners(new Set());
        refetch();
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingBanner(undefined);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage promotional banners and campaigns
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowTester(!showTester)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <TestTube size={16} className="-ml-1 mr-2" />
                        {showTester ? 'Hide' : 'Active Banners Tester'}
                    </button>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
                    >
                        <Plus size={16} className="-ml-1 mr-2" />
                        Create Banner
                    </button>
                </div>
            </div>

            {/* Active Banners Tester */}
            {showTester && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3">Active Banners Tester (Buyer App Simulation)</h3>
                    <div className="flex gap-3 mb-3">
                        <select
                            value={testerZoneId}
                            onChange={(e) => setTesterZoneId(e.target.value)}
                            className="px-3 py-2 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Zones</option>
                            {zonesData?.zones.map(z => (
                                <option key={z.id} value={z.id}>{z.name}</option>
                            ))}
                        </select>
                    </div>
                    {isLoadingActive ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        </div>
                    ) : activeBannersData && activeBannersData.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-xs text-blue-700 font-medium">{activeBannersData.length} active banner(s) found:</p>
                            {activeBannersData.map(banner => (
                                <div key={banner.id} className="bg-white border border-blue-200 rounded p-2 text-xs">
                                    <p className="font-medium">{banner.title}</p>
                                    <p className="text-gray-600">Priority: {banner.priority} • Target: {banner.target_type}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-blue-700">No active banners for this filter</p>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Target Type</label>
                        <select
                            value={targetTypeFilter}
                            onChange={(e) => setTargetTypeFilter(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Types</option>
                            <option value="global">Global</option>
                            <option value="zone">Zone</option>
                            <option value="category">Category</option>
                            <option value="store">Store</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={activeFilter === undefined ? '' : activeFilter.toString()}
                            onChange={(e) => setActiveFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleApplyFilters}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                    >
                        <Filter size={16} className="-ml-1 mr-2" />
                        Apply Filters
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <X size={16} className="-ml-1 mr-2" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedBanners.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">
                            {selectedBanners.size} banner(s) selected
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBulkAction('publish')}
                                disabled={bulkActionMutation.isPending}
                                className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200 disabled:opacity-50"
                            >
                                Publish
                            </button>
                            <button
                                onClick={() => handleBulkAction('unpublish')}
                                disabled={bulkActionMutation.isPending}
                                className="px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded hover:bg-orange-200 disabled:opacity-50"
                            >
                                Unpublish
                            </button>
                            <button
                                onClick={() => setSelectedBanners(new Set())}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banners Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : data?.banners.length === 0 ? (
                <div className="text-center py-12 bg-white border rounded-lg">
                    <p className="text-gray-600 mb-4">No banners found</p>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                    >
                        <Plus size={16} className="-ml-1 mr-2" />
                        Create First Banner
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.banners.map((banner) => (
                        <BannerCard
                            key={banner.id}
                            banner={banner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50">
                        <BannerForm
                            banner={editingBanner}
                            onSubmit={editingBanner ? handleUpdate : handleCreate}
                            onCancel={handleCloseForm}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default BannersList;
