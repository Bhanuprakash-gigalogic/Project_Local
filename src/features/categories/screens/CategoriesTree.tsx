import React, { useState } from 'react';
import { useGetCategoryTree, useCreateCategory, useUpdateCategory, useDeleteCategory, useReorderCategory } from '../hooks/useCategories';
import { CategoryTree, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category';
import CategoryNode from '../components/CategoryNode';
import CategoryForm from '../components/CategoryForm';
import { Plus, Loader2, AlertTriangle, Package } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

const CategoriesTree: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryTree | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryTree | undefined>();
    const [parentIdForNew, setParentIdForNew] = useState<string | null>(null);

    const { data, isLoading, refetch } = useGetCategoryTree();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();
    const reorderMutation = useReorderCategory();

    const handleCreate = async (formData: CreateCategoryDTO | UpdateCategoryDTO) => {
        const payload = { ...formData, parent_id: parentIdForNew } as CreateCategoryDTO;
        await createMutation.mutateAsync(payload);
        setIsFormOpen(false);
        setParentIdForNew(null);
    };

    const handleUpdate = async (formData: CreateCategoryDTO | UpdateCategoryDTO) => {
        if (!editingCategory) return;
        await updateMutation.mutateAsync({ id: editingCategory.id, data: formData as UpdateCategoryDTO });
        setEditingCategory(undefined);
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        const response = await deleteMutation.mutateAsync(id);

        if (!response.can_delete) {
            alert(response.message);
            return;
        }

        if (selectedCategory?.id === id) {
            setSelectedCategory(null);
        }
    };

    const handleEdit = (category: CategoryTree) => {
        setEditingCategory(category);
        setParentIdForNew(null);
        setIsFormOpen(true);
    };

    const handleAddChild = (parentId: string) => {
        setParentIdForNew(parentId);
        setEditingCategory(undefined);
        setIsFormOpen(true);
    };

    const handleMoveUp = async (category: CategoryTree) => {
        await reorderMutation.mutateAsync({
            id: category.id,
            data: { new_sort_order: category.sort_order - 1 }
        });
    };

    const handleMoveDown = async (category: CategoryTree) => {
        await reorderMutation.mutateAsync({
            id: category.id,
            data: { new_sort_order: category.sort_order + 1 }
        });
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingCategory(undefined);
        setParentIdForNew(null);
    };

    return (
        <div className="p-6 h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage product categories with hierarchical structure
                    </p>
                </div>
                <button
                    onClick={() => {
                        setParentIdForNew(null);
                        setEditingCategory(undefined);
                        setIsFormOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
                >
                    <Plus size={16} className="-ml-1 mr-2" />
                    Create Root Category
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-5rem)]">
                {/* Tree Panel */}
                <div className="lg:col-span-2 bg-white border rounded-lg overflow-hidden flex flex-col">
                    <div className="p-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Category Tree</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : data?.categories.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 mb-4">No categories yet</p>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                                >
                                    <Plus size={16} className="-ml-1 mr-2" />
                                    Create First Category
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {data?.categories.map((category, index) => (
                                    <CategoryNode
                                        key={category.id}
                                        category={category}
                                        selectedId={selectedCategory?.id}
                                        onSelect={setSelectedCategory}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onAddChild={handleAddChild}
                                        onMoveUp={index > 0 ? handleMoveUp : undefined}
                                        onMoveDown={index < data.categories.length - 1 ? handleMoveDown : undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Panel */}
                <div className="bg-white border rounded-lg overflow-hidden flex flex-col">
                    <div className="p-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Details</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedCategory ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {selectedCategory.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded ${selectedCategory.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {selectedCategory.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Level {selectedCategory.level}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Slug</p>
                                        <p className="text-gray-900 mt-1">{selectedCategory.slug}</p>
                                    </div>

                                    {selectedCategory.description && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Description</p>
                                            <p className="text-gray-900 mt-1">{selectedCategory.description}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Sort Order</p>
                                        <p className="text-gray-900 mt-1">{selectedCategory.sort_order}</p>
                                    </div>

                                    {selectedCategory.product_count !== undefined && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                                <Package size={16} />
                                                <span className="text-xs font-medium">Products</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {selectedCategory.product_count}
                                            </p>
                                        </div>
                                    )}

                                    {selectedCategory.children.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                                                Subcategories ({selectedCategory.children.length})
                                            </p>
                                            <div className="space-y-1">
                                                {selectedCategory.children.map(child => (
                                                    <div
                                                        key={child.id}
                                                        className="text-sm text-gray-700 hover:text-primary cursor-pointer"
                                                        onClick={() => setSelectedCategory(child)}
                                                    >
                                                        → {child.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedCategory.product_count && selectedCategory.product_count > 0 && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-amber-600 mb-1">
                                                <AlertTriangle size={14} />
                                                <span className="text-xs font-medium">Deletion Warning</span>
                                            </div>
                                            <p className="text-xs text-amber-700">
                                                This category contains {selectedCategory.product_count} product(s) and cannot be deleted until products are moved or removed.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                Select a category to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
                        <CategoryForm
                            category={editingCategory}
                            onSubmit={editingCategory ? handleUpdate : handleCreate}
                            onCancel={handleCloseForm}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default CategoriesTree;
