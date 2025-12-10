import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetZone } from '../hooks/useZones';
import {
    useSearchSellers,
    useGetZoneSellers,
    useBulkAllocateSellers,
    useRemoveSellerFromZone,
    useBulkRemoveSellers
} from '../hooks/useZoneSellers';
import { Loader2, ArrowLeft, Search, UserPlus, Trash2, MapPin, Users, AlertCircle } from 'lucide-react';

const ZoneSellerAllocation: React.FC = () => {
    const { zoneId } = useParams<{ zoneId: string }>();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSellers, setSelectedSellers] = useState<Set<string>>(new Set());

    const { data: zone, isLoading: isLoadingZone } = useGetZone(zoneId!);
    const { data: sellersData } = useSearchSellers({ search: searchTerm, limit: 50 });
    const { data: zoneSellers, isLoading: isLoadingZoneSellers } = useGetZoneSellers(zoneId!);

    const allocateMutation = useBulkAllocateSellers();
    const removeMutation = useRemoveSellerFromZone();
    const bulkRemoveMutation = useBulkRemoveSellers();

    const handleToggleSeller = (sellerId: string) => {
        const newSet = new Set(selectedSellers);
        if (newSet.has(sellerId)) {
            newSet.delete(sellerId);
        } else {
            newSet.add(sellerId);
        }
        setSelectedSellers(newSet);
    };

    const handleAllocate = async () => {
        if (selectedSellers.size === 0 || !zoneId) return;

        await allocateMutation.mutateAsync({
            zone_id: zoneId,
            seller_ids: Array.from(selectedSellers),
        });

        setSelectedSellers(new Set());
        setSearchTerm('');
    };

    const handleRemove = async (sellerId: string) => {
        if (!confirm('Remove this seller from the zone?') || !zoneId) return;

        await removeMutation.mutateAsync({
            zone_id: zoneId,
            seller_id: sellerId,
        });
    };

    const handleBulkRemove = async () => {
        if (!confirm('Remove ALL sellers from this zone? This action cannot be undone.') || !zoneId) return;

        await bulkRemoveMutation.mutateAsync(zoneId);
    };

    // Filter out already allocated sellers
    const allocatedSellerIds = new Set(zoneSellers?.sellers.map(s => s.seller_id) || []);
    const availableSellers = sellersData?.sellers.filter(s => !allocatedSellerIds.has(s.id)) || [];

    if (isLoadingZone) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!zone) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600">Zone not found</p>
                    <button
                        onClick={() => navigate('/admin/zones')}
                        className="mt-4 text-primary hover:underline"
                    >
                        Back to Zones
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/zones')}
                    className="p-2 hover:bg-gray-100 rounded"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Seller Allocation</h1>
                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <MapPin size={16} />
                        <span>{zone.name}</span>
                        <span className="text-gray-400">•</span>
                        <span>{zone.city}, {zone.country}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Sellers */}
                <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Available Sellers</h2>
                        <span className="text-sm text-gray-600">
                            {selectedSellers.size} selected
                        </span>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search sellers by name, email, or phone..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Sellers List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {availableSellers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? 'No sellers found' : 'All sellers are already allocated'}
                            </div>
                        ) : (
                            availableSellers.map((seller) => (
                                <label
                                    key={seller.id}
                                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSellers.has(seller.id)}
                                        onChange={() => handleToggleSeller(seller.id)}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <div className="ml-3 flex-1">
                                        <p className="font-medium text-gray-900">{seller.name}</p>
                                        <p className="text-sm text-gray-500">{seller.email}</p>
                                        <p className="text-sm text-gray-500">{seller.phone}</p>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>

                    {/* Allocate Button */}
                    <button
                        onClick={handleAllocate}
                        disabled={selectedSellers.size === 0 || allocateMutation.isPending}
                        className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {allocateMutation.isPending ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Allocating...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} className="mr-2" />
                                Allocate {selectedSellers.size} Seller{selectedSellers.size !== 1 ? 's' : ''}
                            </>
                        )}
                    </button>
                </div>

                {/* Allocated Sellers */}
                <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Allocated Sellers ({zoneSellers?.total || 0})
                        </h2>
                        {zoneSellers && zoneSellers.total > 0 && (
                            <button
                                onClick={handleBulkRemove}
                                disabled={bulkRemoveMutation.isPending}
                                className="text-sm text-red-600 hover:underline disabled:opacity-50"
                            >
                                Remove All
                            </button>
                        )}
                    </div>

                    {isLoadingZoneSellers ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : zoneSellers?.sellers.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 border border-dashed rounded-lg">
                            <Users size={48} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600 mb-2">No sellers allocated yet</p>
                            <p className="text-sm text-gray-500">
                                Select sellers from the left panel to allocate them
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {zoneSellers?.sellers.map((zoneSeller) => (
                                <div
                                    key={zoneSeller.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{zoneSeller.seller_name}</p>
                                        <p className="text-sm text-gray-500">{zoneSeller.seller_email}</p>
                                        <p className="text-sm text-gray-500">{zoneSeller.seller_phone}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Allocated {new Date(zoneSeller.allocated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(zoneSeller.seller_id)}
                                        disabled={removeMutation.isPending}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                        title="Remove seller"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-medium text-blue-900">About Seller Allocation</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Sellers allocated to this zone will be able to accept and fulfill orders from customers within the zone boundary. You can allocate multiple sellers to the same zone for better coverage.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZoneSellerAllocation;
