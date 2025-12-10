import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetModule14ById, useDeleteModule14, useUpdateModule14 } from '../hooks/useModule14';
import Module14Form from '../components/Module14Form';
import { ArrowLeft, Edit2, Trash2, Loader2, Calendar, Hash } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { UpdateModule14DTO } from '../types/module14';

const Module14Detail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: item, isLoading } = useGetModule14ById(id!);
    const deleteMutation = useDeleteModule14();
    const updateMutation = useUpdateModule14();

    const handleDelete = async () => {
        if (!confirm('Delete this item?')) return;
        await deleteMutation.mutateAsync(id!);
        navigate('/admin/module-14');
    };

    const handleUpdate = async (data: UpdateModule14DTO) => {
        await updateMutation.mutateAsync({ id: id!, data });
        setIsEditOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="p-6">
                <p className="text-gray-600">Item not found</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/module-14')}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${item.is_active
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {item.is_active ? 'Active' : 'Inactive'}
                            </span>
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
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200"
                    >
                        <Trash2 size={16} className="-ml-1 mr-2" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Details */}
            <div className="bg-white border rounded-lg p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                            <p className="text-gray-900">{item.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Slug</label>
                            <p className="text-gray-900 font-mono text-sm">{item.slug}</p>
                        </div>
                        {item.description && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                <p className="text-gray-900">{item.description}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                            <p className="text-gray-900">{item.is_active ? 'Active' : 'Inactive'}</p>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Metadata</h3>
                        <pre className="bg-gray-50 border rounded p-4 text-sm font-mono overflow-x-auto">
                            {JSON.stringify(item.metadata, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Audit Trail */}
                <div className="border-t pt-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Audit Trail</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Calendar size={14} />
                                <span className="font-medium">Created At</span>
                            </div>
                            <p className="text-gray-900">{new Date(item.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Calendar size={14} />
                                <span className="font-medium">Updated At</span>
                            </div>
                            <p className="text-gray-900">{new Date(item.updated_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Hash size={14} />
                                <span className="font-medium">ID</span>
                            </div>
                            <p className="text-gray-900 font-mono text-sm">{item.id}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50">
                        <Module14Form
                            Module14={item}
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

export default Module14Detail;



