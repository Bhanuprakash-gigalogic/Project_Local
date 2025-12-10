import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Folder, FolderPlus, ChevronRight, ChevronDown, Plus } from 'lucide-react';

interface CategoryStepProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

const categorySchema = z.object({
    name: z.string().min(2, 'Name is required'),
    parentId: z.string().optional(),
});

type CategoryFormInputs = z.infer<typeof categorySchema>;

interface CategoryNode {
    id: string;
    name: string;
    children?: CategoryNode[];
}

const CategoryForm: React.FC<CategoryStepProps> = ({ onComplete, onCancel }) => {
    // Mock existing categories
    const [categories, setCategories] = useState<CategoryNode[]>([
        { id: '1', name: 'Electronics', children: [] },
        { id: '2', name: 'Fashion', children: [] }
    ]);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormInputs>({
        resolver: zodResolver(categorySchema)
    });

    const onSubmit = (data: CategoryFormInputs) => {
        const newCat: CategoryNode = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name,
            children: []
        };

        if (data.parentId) {
            setCategories(prev => prev.map(c => {
                if (c.id === data.parentId) {
                    return { ...c, children: [...(c.children || []), newCat] };
                }
                return c;
            }));
        } else {
            setCategories(prev => [...prev, newCat]);
        }

        setShowForm(false);
        reset();
    };

    const handleNext = () => {
        // Submit the entire tree or just proceed
        onComplete({ categories });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium">Manage Categories</h3>
                    <p className="text-sm text-gray-500">
                        Create root categories and sub-categories for your product catalog.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4 mr-1" /> Add Category
                </button>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-xl p-4 bg-gray-50/50">
                {/* Tree View Mock */}
                <div className="space-y-2">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white p-3 rounded-lg border shadow-sm">
                            <div className="flex items-center gap-2 font-medium text-gray-700">
                                <Folder className="h-4 w-4 text-blue-500" />
                                {cat.name}
                            </div>
                            {cat.children && cat.children.length > 0 && (
                                <div className="ml-6 mt-2 space-y-2 border-l-2 pl-3">
                                    {cat.children.map(child => (
                                        <div key={child.id} className="text-sm flex items-center gap-2 text-gray-600">
                                            <span className="w-2 h-px bg-gray-300"></span>
                                            {child.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    // Pre-fill parent ID logic
                                    reset({ parentId: cat.id });
                                    setShowForm(true);
                                }}
                                className="ml-6 mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <Plus size={12} /> Add Subcategory
                            </button>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="text-center text-sm text-gray-500 py-8">
                            No categories created yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Inline Form */}
            {showForm && (
                <div className="mt-4 p-4 bg-white border border-blue-100 rounded-lg shadow-sm animate-in slide-in-from-bottom-2">
                    <h4 className="text-sm font-semibold mb-3">Add New Category</h4>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="Category Name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border px-3 py-1.5"
                                autoFocus
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary/90"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="pt-4 flex justify-between items-center border-t mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
                >
                    Next Step: Banners
                </button>
            </div>
        </div>
    );
};

export default CategoryForm;
