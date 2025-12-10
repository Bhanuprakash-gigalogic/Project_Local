import React from 'react';
import { Zone } from '../types/zone';
import { MapPin, Edit2, Trash2, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ZoneCardProps {
    zone: Zone;
    isSelected?: boolean;
    onSelect?: (id: string, selected: boolean) => void;
    onEdit?: (zone: Zone) => void;
    onDelete?: (id: string) => void;
    onToggleActive?: (id: string, isActive: boolean) => void;
}

const ZoneCard: React.FC<ZoneCardProps> = ({
    zone,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    onToggleActive,
}) => {
    const navigate = useNavigate();

    return (
        <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${zone.deleted_at ? 'bg-gray-50 opacity-60' : 'bg-white'
            }`}>
            <div className="flex items-start gap-3">
                {onSelect && (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelect(zone.id, e.target.checked)}
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {zone.name}
                        </h3>
                        {zone.is_active ? (
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
                        {zone.deleted_at && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Deleted
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{zone.city}{zone.state ? `, ${zone.state}` : ''}, {zone.country}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            {zone.polygon_coords.length} coordinates
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Created: {new Date(zone.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Updated: {new Date(zone.updated_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => navigate(`/admin/zones/${zone.id}`)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    {onEdit && !zone.deleted_at && (
                        <button
                            onClick={() => onEdit(zone)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}
                    {onToggleActive && !zone.deleted_at && (
                        <button
                            onClick={() => onToggleActive(zone.id, !zone.is_active)}
                            className={`p-2 rounded ${zone.is_active
                                    ? 'text-orange-600 hover:bg-orange-50'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                            title={zone.is_active ? 'Deactivate' : 'Activate'}
                        >
                            {zone.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(zone.id)}
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

export default ZoneCard;
