import React, { useState } from 'react';
import { useGetStores, useCreateStore, useUpdateStore, useDeleteStore, useToggleStoreActive, useBulkStoreAction } from '../hooks/useStores';
import { Store, CreateStoreDTO, UpdateStoreDTO, StoreFilters } from '../types/store';
import StoreCard from '../components/StoreCard';
import StoreForm from '../components/StoreForm';
import { Plus, Search, Filter, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useGetZones } from '../../zones/hooks/useZones';

const StoresList: React.FC = () => {
    const [filters, setFilters] = useState<StoreFilters>({
        limit: 10,
        page: 1,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [zoneFilter, setZoneFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | undefined>();
    const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());

    const { data, isLoading, refetch } = useGetStores(filters);
    const { data: zonesData } = useGetZones({ limit: 100 });
    const createMutation = useCreateStore();
    const updateMutation = useUpdateStore();
    const deleteMutation = useDeleteStore();
    const toggleActiveMutation = useToggleStoreActive();
    const bulkActionMutation = useBulkStoreAction();

    const handleSearch = () => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm || undefined,
            zone_id: zoneFilter || undefined,
            is_active: activeFilter,
            page: 1,
        }));
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setZoneFilter('');
        setActiveFilter(undefined);
        setFilters({ limit: 10, page: 1 });
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleSelectStore = (id: string, selected: boolean) => {
        setSelectedStores(prev => {
            const next = new Set(prev);
            if (selected) {
                next.add(id);
            } else {
                next.delete(id);
            }
            return next;
        });
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected && data?.stores) {
            setSelectedStores(new Set(data.stores.map(s => s.id)));
        } else {
            setSelectedStores(new Set());
        }
    };

    const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
        if (selectedStores.size === 0) return;

        if (action === 'delete') {
            if (!confirm(`Delete ${selectedStores.size} store(s)?`)) return;
        }

        await bulkActionMutation.mutateAsync({
            store_ids: Array.from(selectedStores),
            action,
        });

        setSelectedStores(new Set());
        refetch();
    };

    const handleCreate = async (formData: CreateStoreDTO | UpdateStoreDTO) => {
        await createMutation.mutateAsync(formData as CreateStoreDTO);
        setIsFormOpen(false);
    };

    const handleUpdate = async (formData: CreateStoreDTO | UpdateStoreDTO) => {
        if (!editingStore) return;
        await updateMutation.mutateAsync({ id: editingStore.id, data: formData as UpdateStoreDTO });
        setEditingStore(undefined);
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this store?')) return;
        await deleteMutation.mutateAsync(id);
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        await toggleActiveMutation.mutateAsync({ id, is_active: isActive });
    };

    const handleEdit = (store: Store) => {
        setEditingStore(store);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingStore(undefined);
    };

    const totalPages = data ? Math.ceil(data.total / (filters.limit || 10)) : 1;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage stores and link them to delivery zones
                    </p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
                >
                    <Plus size={16} className="-ml-1 mr-2" />
                    Create Store
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search stores..."
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Zone
                        </label>
                        <select
                            value={zoneFilter}
                            onChange={(e) => setZoneFilter(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Zones</option>
                            {zonesData?.zones.map((zone) => (
                                <option key={zone.id} value={zone.id}>
                                    {zone.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Status
                        </label>
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
                        onClick={handleSearch}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
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
            {selectedStores.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">
                            {selectedStores.size} store(s) selected
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBulkAction('activate')}
                                disabled={bulkActionMutation.isPending}
                                className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200 disabled:opacity-50"
                            >
                                Activate
                            </button>
                            <button
                                onClick={() => handleBulkAction('deactivate')}
                                disabled={bulkActionMutation.isPending}
                                className="px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded hover:bg-orange-200 disabled:opacity-50"
                            >
                                Deactivate
                            </button>
                            <button
                                onClick={() => handleBulkAction('delete')}
                                disabled={bulkActionMutation.isPending}
                                className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded hover:bg-red-200 disabled:opacity-50"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setSelectedStores(new Set())}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stores List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : data?.stores.length === 0 ? (
                    <div className="text-center py-12 bg-white border rounded-lg">
                        <p className="text-gray-600">No stores found</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                        >
                            <Plus size={16} className="-ml-1 mr-2" />
                            Create First Store
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 px-4">
                            <input
                                type="checkbox"
                                checked={selectedStores.size === data?.stores.length && data?.stores.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-600">Select All</span>
                        </div>
                        {data?.stores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                isSelected={selectedStores.has(store.id)}
                                onSelect={handleSelectStore}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleActive={handleToggleActive}
                            />
                        ))}
                    </>
                )}
            </div>

            {/* Pagination */}
            {data && data.total > (filters.limit || 10) && (
                <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                    <div className="text-sm text-gray-600">
                        Showing page {filters.page} of {totalPages} ({data.total} total stores)
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange((filters.page || 1) - 1)}
                            disabled={filters.page === 1}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} className="-ml-1 mr-1" />
                            Previous
                        </button>
                        <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                            Page {filters.page} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange((filters.page || 1) + 1)}
                            disabled={filters.page === totalPages}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight size={16} className="-mr-1 ml-1" />
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
                        <StoreForm
                            store={editingStore}
                            onSubmit={editingStore ? handleUpdate : handleCreate}
                            onCancel={handleCloseForm}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default StoresList;
