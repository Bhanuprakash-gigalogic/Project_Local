import React from 'react';
import { Store } from '../types/store';
import { Building2, Edit2, Trash2, Eye, CheckCircle2, XCircle, Users, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StoreCardProps {
    store: Store;
    isSelected?: boolean;
    onSelect?: (id: string, selected: boolean) => void;
    onEdit?: (store: Store) => void;
    onDelete?: (id: string) => void;
    onToggleActive?: (id: string, isActive: boolean) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({
    store,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    onToggleActive,
}) => {
    const navigate = useNavigate();

    return (
        <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${store.deleted_at ? 'bg-gray-50 opacity-60' : 'bg-white'
            }`}>
            <div className="flex items-start gap-3">
                {onSelect && (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelect(store.id, e.target.checked)}
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {store.name}
                        </h3>
                        {store.is_active ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 size={12} className="mr-1" />
                                Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                <XCircle size={12} className="mr-1" />
                                Inactive
                            </span>
                        )}
                        {store.deleted_at && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Deleted
                            </span>
                        )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                            <Building2 size={14} />
                            <span className="truncate">{store.address}</span>
                        </div>
                        {store.zone_name && (
                            <div className="text-xs text-gray-500">
                                Zone: {store.zone_name}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        {store.total_sellers !== undefined && (
                            <div className="flex items-center gap-1">
                                <Users size={12} />
                                <span>{store.total_sellers} sellers</span>
                            </div>
                        )}
                        {store.total_products !== undefined && (
                            <div className="flex items-center gap-1">
                                <Package size={12} />
                                <span>{store.total_products} products</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => navigate(`/admin/stores/${store.id}`)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    {onEdit && !store.deleted_at && (
                        <button
                            onClick={() => onEdit(store)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}
                    {onToggleActive && !store.deleted_at && (
                        <button
                            onClick={() => onToggleActive(store.id, !store.is_active)}
                            className={`p-2 rounded ${store.is_active
                                    ? 'text-orange-600 hover:bg-orange-50'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                            title={store.is_active ? 'Deactivate' : 'Activate'}
                        >
                            {store.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(store.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreCard;
