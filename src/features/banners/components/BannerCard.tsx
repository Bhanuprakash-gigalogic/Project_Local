import React, { useState } from 'react';
import { Banner } from '../types/banner';
import { Edit2, Trash2, Copy, MoreVertical, CheckCircle2, XCircle, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BannerCardProps {
    banner: Banner;
    onEdit?: (banner: Banner) => void;
    onDelete?: (id: string) => void;
    onDuplicate?: (banner: Banner) => void;
    onToggleStatus?: (id: string, isActive: boolean) => void;
}

const BannerCard: React.FC<BannerCardProps> = ({
    banner,
    onEdit,
    onDelete,
    onDuplicate,
    onToggleStatus,
}) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const isActive = banner.is_active;
    const now = new Date();
    const startDate = new Date(banner.start_date);
    const endDate = new Date(banner.end_date);
    const isLive = isActive && now >= startDate && now <= endDate;

    return (
        <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <div
                className="relative aspect-[3/1] bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/admin/banners/${banner.id}`)}
            >
                <img
                    src={banner.desktop_image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/1200x400/CCCCCC/666666?text=Banner+Image';
                    }}
                />
                {isLive && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                        LIVE
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-gray-900 truncate flex-1">
                        {banner.title}
                    </h3>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <MoreVertical size={16} />
                        </button>
                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-20">
                                    {onEdit && (
                                        <button
                                            onClick={() => {
                                                onEdit(banner);
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                    )}
                                    {onToggleStatus && (
                                        <button
                                            onClick={() => {
                                                onToggleStatus(banner.id, !banner.is_active);
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            {banner.is_active ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                            {banner.is_active ? 'Unpublish' : 'Publish'}
                                        </button>
                                    )}
                                    {onDuplicate && (
                                        <button
                                            onClick={() => {
                                                onDuplicate(banner);
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Copy size={14} />
                                            Duplicate
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => {
                                                onDelete(banner.id);
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                        <Target size={12} />
                        <span className="capitalize">{banner.target_type}</span>
                        {banner.target_name && (
                            <span className="text-gray-400">• {banner.target_name}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>
                            {new Date(banner.start_date).toLocaleDateString()} - {new Date(banner.end_date).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded ${banner.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                        {banner.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Priority: {banner.priority}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BannerCard;
