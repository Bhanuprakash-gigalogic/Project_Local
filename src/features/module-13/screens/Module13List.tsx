import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useGetModule13,
    useCreateModule13,
    useDeleteModule13,
    useBulkDeleteModule13,
    useExportModule13
} from '../hooks/useModule13';
import { Module13, CreateModule13DTO, UpdateModule13DTO, Module13Filters } from '../types/module13';
import Module13Form from '../components/Module13Form';
import {
    Plus,
    Loader2,
    Search,
    Filter,
    Download,
    Upload,
    Trash2,
    Edit2,
    Eye,
    X
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

const Module13List: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Module13Filters>({ limit: 10, page: 1 });
    const [searchInput, setSearchInput] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
    const [sortBy, setSortBy] = useState<'name' | 'created_at'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showImportModal, setShowImportModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { data, isLoading, error } = useGetModule13(filters);
    const createMutation = useCreateModule13();
    const deleteMutation = useDeleteModule13();
    const bulkDeleteMutation = useBulkDeleteModule13();
    const exportMutation = useExportModule13();

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput || undefined, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleApplyFilters = () => {
        setFilters(prev => ({
            ...prev,
            is_active: activeFilter,
            sort_by: sortBy,
            sort_order: sortOrder,
            page: 1,
        }));
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setActiveFilter(undefined);
        setSortBy('created_at');
        setSortOrder('desc');
        setFilters({ limit: 10, page: 1 });
    };

    const handleCreate = async (formData: CreateModule13DTO | UpdateModule13DTO) => {
        await createMutation.mutateAsync(formData as CreateModule13DTO);
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        await deleteMutation.mutateAsync(id);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        await bulkDeleteMutation.mutateAsync({ ids: Array.from(selectedIds) });
        setSelectedIds(new Set());
        setShowDeleteConfirm(false);
    };

    const handleExport = async () => {
        await exportMutation.mutateAsync(filters);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked && data?.items) {
            setSelectedIds(new Set(data.items.map(item => item.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds);
        if (checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        setSelectedIds(newSet);
    };

    const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage inventory items
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <Upload size={16} className="-ml-1 mr-2" />
                        Import CSV
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exportMutation.isPending}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        {exportMutation.isPending ? (
                            <Loader2 size={16} className="animate-spin -ml-1 mr-2" />
                        ) : (
                            <Download size={16} className="-ml-1 mr-2" />
                        )}
                        Export CSV
                    </button>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
                    >
                        <Plus size={16} className="-ml-1 mr-2" />
                        Create Inventory Item
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border rounded-lg p-4 space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by name, slug, or description..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'created_at')}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="created_at">Created Date</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-2">
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
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">
                            {selectedIds.size} item(s) selected
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={bulkDeleteMutation.isPending}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded hover:bg-red-200 disabled:opacity-50"
                            >
                                <Trash2 size={14} className="-ml-1 mr-2" />
                                Delete Selected
                            </button>
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12 bg-white border rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="p-6 bg-white border rounded-lg">
                    <p className="text-red-600">Error loading data</p>
                </div>
            ) : data?.items.length === 0 ? (
                <div className="text-center py-12 bg-white border rounded-lg">
                    <p className="text-gray-600 mb-4">No items found</p>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                    >
                        <Plus size={16} className="-ml-1 mr-2" />
                        Create First Item
                    </button>
                </div>
            ) : (
                <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="w-12 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={data?.items && data.items.length > 0 && selectedIds.size === data.items.length}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Slug</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data?.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(item.id)}
                                                onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            {item.description && (
                                                <div className="text-sm text-gray-500 truncate max-w-md">{item.description}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.slug}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 text-xs rounded ${item.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/module-13/${item.id}`)}
                                                    className="p-1 text-gray-600 hover:text-primary"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1 text-gray-600 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <div className="text-sm text-gray-600">
                                Showing {((data?.page || 1) - 1) * (data?.limit || 10) + 1} to{' '}
                                {Math.min((data?.page || 1) * (data?.limit || 10), data?.total || 0)} of {data?.total || 0} results
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                                    disabled={filters.page === 1}
                                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                                    disabled={filters.page === totalPages}
                                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50">
                        <Module13Form
                            onSubmit={handleCreate}
                            onCancel={() => setIsFormOpen(false)}
                            isLoading={createMutation.isPending}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Import CSV Modal */}
            <Dialog.Root open={showImportModal} onOpenChange={setShowImportModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Import CSV</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                CSV import functionality will be implemented in a future update.
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowImportModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Bulk Delete Confirm */}
            <Dialog.Root open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Confirm Bulk Delete</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Are you sure you want to delete {selectedIds.size} item(s)? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={bulkDeleteMutation.isPending}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                                >
                                    {bulkDeleteMutation.isPending && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default Module13List;
