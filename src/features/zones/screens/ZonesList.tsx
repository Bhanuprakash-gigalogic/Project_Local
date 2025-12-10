import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetZones, useDeleteZone } from '../hooks/useZones';
import { ZoneFilters } from '../types/zone';
import {
    Loader2,
    Plus,
    Search,
    MapPin,
    Edit2,
    Trash2,
    Users,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const ZonesList: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

    const filters: ZoneFilters = {
        search: search || undefined,
        limit,
        offset: page * limit,
        is_active: activeFilter,
        sort: '-created_at'
    };

    const { data, isLoading } = useGetZones(filters);
    const deleteMutation = useDeleteZone();

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete zone "${name}"? This action cannot be undone.`)) return;
        await deleteMutation.mutateAsync(id);
    };

    const totalPages = data ? Math.ceil(data.total / limit) : 0;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Zones Management</h1>
                    <p className="text-gray-600 mt-1">Create and manage delivery zones</p>
                </div>
                <button
                    onClick={() => navigate('/admin/zones/create')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                >
                    <Plus size={16} className="mr-2" />
                    Create Zone
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(0);
                                }}
                                placeholder="Search zones by name or city..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Active Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setActiveFilter(undefined);
                                setPage(0);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeFilter === undefined
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => {
                                setActiveFilter(true);
                                setPage(0);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeFilter === true
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => {
                                setActiveFilter(false);
                                setPage(0);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeFilter === false
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Inactive
                        </button>
                    </div>

                    {/* Per Page */}
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(0);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border rounded-lg overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : data?.zones && data.zones.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Zone Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sellers
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.zones.map((zone) => (
                                        <tr key={zone.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <MapPin size={16} className="text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {zone.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {zone.city}{zone.state ? `, ${zone.state}` : ''}
                                                </div>
                                                <div className="text-sm text-gray-500">{zone.country}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {zone.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle2 size={12} className="mr-1" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        <XCircle size={12} className="mr-1" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => navigate(`/admin/zones/${zone.id}/sellers`)}
                                                    className="inline-flex items-center text-sm text-primary hover:underline"
                                                >
                                                    <Users size={14} className="mr-1" />
                                                    {zone.seller_count || 0}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(zone.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/zones/${zone.id}/edit`)}
                                                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded"
                                                        title="Edit zone"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/zones/${zone.id}/sellers`)}
                                                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Manage sellers"
                                                    >
                                                        <Users size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(zone.id, zone.name)}
                                                        disabled={deleteMutation.isPending}
                                                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                                        title="Delete zone"
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
                        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{page * limit + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min((page + 1) * limit, data.total)}
                                </span>{' '}
                                of <span className="font-medium">{data.total}</span> zones
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={16} className="mr-1" />
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ChevronRight size={16} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">No zones found</p>
                        <button
                            onClick={() => navigate('/admin/zones/create')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                        >
                            <Plus size={16} className="mr-2" />
                            Create Your First Zone
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZonesList;
