import React, { useState } from 'react';
import { CategoryTree } from '../types/category';
import { ChevronRight, ChevronDown, GripVertical, Edit2, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';

interface CategoryNodeProps {
    category: CategoryTree;
    selectedId?: string;
    onSelect: (category: CategoryTree) => void;
    onEdit: (category: CategoryTree) => void;
    onDelete: (id: string) => void;
    onAddChild: (parentId: string) => void;
    onMoveUp?: (category: CategoryTree) => void;
    onMoveDown?: (category: CategoryTree) => void;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
    category,
    selectedId,
    onSelect,
    onEdit,
    onDelete,
    onAddChild,
    onMoveUp,
    onMoveDown,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedId === category.id;

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer group ${isSelected ? 'bg-primary/10 border-l-2 border-primary' : ''
                    }`}
                style={{ paddingLeft: `${category.level * 20 + 8}px` }}
            >
                {/* Expand/Collapse */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-0.5 hover:bg-gray-200 rounded"
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                        <span className="w-3.5 inline-block" />
                    )}
                </button>

                {/* Drag Handle */}
                <div className="cursor-move opacity-0 group-hover:opacity-100">
                    <GripVertical size={14} className="text-gray-400" />
                </div>

                {/* Category Name */}
                <div
                    onClick={() => onSelect(category)}
                    className="flex-1 min-w-0 flex items-center gap-2"
                >
                    <span className="text-sm font-medium text-gray-900 truncate">
                        {category.name}
                    </span>
                    {!category.is_active && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                            Inactive
                        </span>
                    )}
                    {category.product_count !== undefined && category.product_count > 0 && (
                        <span className="text-xs text-gray-500">
                            ({category.product_count})
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    {onMoveUp && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveUp(category);
                            }}
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                            title="Move Up"
                        >
                            <ArrowUp size={12} />
                        </button>
                    )}
                    {onMoveDown && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveDown(category);
                            }}
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                            title="Move Down"
                        >
                            <ArrowDown size={12} />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddChild(category.id);
                        }}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Add Subcategory"
                    >
                        <Plus size={12} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(category);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(category.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div>
                    {category.children.map((child, index) => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                            onMoveUp={index > 0 ? onMoveUp : undefined}
                            onMoveDown={index < category.children.length - 1 ? onMoveDown : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryNode;
