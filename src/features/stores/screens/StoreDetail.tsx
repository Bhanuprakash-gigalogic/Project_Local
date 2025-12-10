import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetStore, useDeleteStore, useRestoreStore, useUpdateStore } from '../hooks/useStores';
import { Loader2, ArrowLeft, Edit2, Trash2, Building2, CheckCircle2, XCircle, RotateCcw, Users, Package, UserPlus } from 'lucide-react';
import StoreForm from '../components/StoreForm';
import { UpdateStoreDTO } from '../types/store';
import * as Dialog from '@radix-ui/react-dialog';

const StoreDetail: React.FC = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: store, isLoading } = useGetStore(storeId!);
    const deleteMutation = useDeleteStore();
    const restoreMutation = useRestoreStore();
    const updateMutation = useUpdateStore();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this store?')) return;
        await deleteMutation.mutateAsync(storeId!);
        navigate('/admin/stores');
    };

    const handleRestore = async () => {
        await restoreMutation.mutateAsync(storeId!);
    };

    const handleUpdate = async (data: UpdateStoreDTO) => {
        await updateMutation.mutateAsync({ id: storeId!, data });
        setIsEditOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!store) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600">Store not found</p>
                    <button
                        onClick={() => navigate('/admin/stores')}
                        className="mt-4 text-primary hover:underline"
                    >
                        Back to Stores
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/stores')}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                            <Building2 size={14} />
                            {store.address}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {store.deleted_at ? (
                        <button
                            onClick={handleRestore}
                            disabled={restoreMutation.isPending}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {restoreMutation.isPending ? (
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            ) : (
                                <RotateCcw size={16} className="-ml-1 mr-2" />
                            )}
                            Restore
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate(`/admin/stores/${storeId}/allocate`)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                <UserPlus size={16} className="-ml-1 mr-2" />
                                Allocate Sellers
                            </button>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <Edit2 size={16} className="-ml-1 mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? (
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                ) : (
                                    <Trash2 size={16} className="-ml-1 mr-2" />
                                )}
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
                {store.is_active ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle2 size={14} className="mr-1" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <XCircle size={14} className="mr-1" />
                        Inactive
                    </span>
                )}
                {store.deleted_at && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Deleted on {new Date(store.deleted_at).toLocaleDateString()}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Metrics */}
                <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Metrics</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <Users size={20} />
                                <span className="text-sm font-medium">Total Sellers</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                                {store.total_sellers ?? 0}
                            </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-600 mb-1">
                                <Package size={20} />
                                <span className="text-sm font-medium">Total Products</span>
                            </div>
                            <p className="text-2xl font-bold text-green-900">
                                {store.total_products ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="bg-white border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Details</h2>

                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Store ID</p>
                        <p className="text-sm text-gray-900 mt-1">{store.id}</p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Zone</p>
                        <p className="text-sm text-gray-900 mt-1">
                            {store.zone_name || store.zone_id}
                        </p>
                    </div>

                    {store.contact && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Contact</p>
                            <p className="text-sm text-gray-900 mt-1">{store.contact}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Created</p>
                        <p className="text-sm text-gray-900 mt-1">
                            {new Date(store.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Last Updated</p>
                        <p className="text-sm text-gray-900 mt-1">
                            {new Date(store.updated_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Description */}
            {store.description && (
                <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                    <p className="text-sm text-gray-700">{store.description}</p>
                </div>
            )}

            {/* Edit Modal */}
            <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
                        <StoreForm
                            store={store}
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

export default StoreDetail;
