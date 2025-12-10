import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useSearchSellers,
    useGetStoreSellers,
    useBulkAllocateSellers,
    useRemoveSeller,
    useRemoveAllSellers
} from '../hooks/useStoreSellers';
import { useGetStore } from '../hooks/useStores';
import { Seller } from '../types/sellerAllocation';
import {
    ArrowLeft,
    Search,
    Loader2,
    UserPlus,
    X,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Users,
    AlertTriangle
} from 'lucide-react';

const AllocateSellers: React.FC = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSellers, setSelectedSellers] = useState<Set<string>>(new Set());
    const [showProgress, setShowProgress] = useState(false);

    const { data: store } = useGetStore(storeId!);
    const { data: searchResults, isLoading: isSearching } = useSearchSellers(searchQuery);
    const { data: allocatedData, isLoading: isLoadingAllocated } = useGetStoreSellers(storeId!);
    const { allocate, progress, isAllocating, resetProgress } = useBulkAllocateSellers(storeId!);
    const removeMutation = useRemoveSeller(storeId!);
    const removeAllMutation = useRemoveAllSellers(storeId!);

    const handleSelectSeller = (sellerId: string) => {
        setSelectedSellers(prev => {
            const next = new Set(prev);
            if (next.has(sellerId)) {
                next.delete(sellerId);
            } else {
                next.add(sellerId);
            }
            return next;
        });
    };

    const handleAllocateSelected = async () => {
        if (selectedSellers.size === 0) return;

        setShowProgress(true);

        const sellerNames = new Map<string, string>();
        searchResults?.sellers.forEach(s => {
            if (selectedSellers.has(s.id)) {
                sellerNames.set(s.id, s.name);
            }
        });

        await allocate(Array.from(selectedSellers), sellerNames);
        setSelectedSellers(new Set());
    };

    const handleRemoveSeller = async (sellerId: string) => {
        if (!confirm('Remove this seller from the store?')) return;
        await removeMutation.mutateAsync(sellerId);
    };

    const handleRemoveAll = async () => {
        if (!confirm('Are you sure you want to remove ALL sellers from this store?')) return;
        if (!confirm('This action cannot be undone. Proceed?')) return;
        await removeAllMutation.mutateAsync();
    };

    const handleCloseProgress = () => {
        setShowProgress(false);
        resetProgress();
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/admin/stores/${storeId}`)}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Allocate Sellers</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {store?.name || 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Search & Allocate Panel */}
                <div className="bg-white border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <UserPlus size={20} />
                        Search & Allocate Sellers
                    </h2>

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search sellers by name or email..."
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Search Results */}
                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                        {isSearching ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : searchQuery.length < 2 ? (
                            <div className="text-center py-8 text-sm text-gray-500">
                                Type at least 2 characters to search
                            </div>
                        ) : searchResults?.sellers.length === 0 ? (
                            <div className="text-center py-8 text-sm text-gray-500">
                                No sellers found
                            </div>
                        ) : (
                            <div className="divide-y">
                                {searchResults?.sellers.map((seller) => (
                                    <label
                                        key={seller.id}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSellers.has(seller.id)}
                                            onChange={() => handleSelectSeller(seller.id)}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {seller.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {seller.email}
                                            </p>
                                        </div>
                                        {!seller.is_active && (
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                                Inactive
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Allocate Button */}
                    <button
                        onClick={handleAllocateSelected}
                        disabled={selectedSellers.size === 0 || isAllocating}
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAllocating ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Allocating...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} className="-ml-1 mr-2" />
                                Allocate Selected ({selectedSellers.size})
                            </>
                        )}
                    </button>
                </div>

                {/* Allocated Sellers Panel */}
                <div className="bg-white border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Users size={20} />
                            Allocated Sellers ({allocatedData?.total || 0})
                        </h2>
                        {allocatedData && allocatedData.total > 0 && (
                            <button
                                onClick={handleRemoveAll}
                                disabled={removeAllMutation.isPending}
                                className="text-xs px-3 py-1.5 text-red-700 bg-red-50 border border-red-300 rounded hover:bg-red-100 disabled:opacity-50"
                            >
                                Remove All
                            </button>
                        )}
                    </div>

                    {/* Allocated List */}
                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                        {isLoadingAllocated ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : allocatedData?.sellers.length === 0 ? (
                            <div className="text-center py-8 text-sm text-gray-500">
                                No sellers allocated yet
                            </div>
                        ) : (
                            <div className="divide-y">
                                {allocatedData?.sellers.map((seller) => (
                                    <div
                                        key={seller.id}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {seller.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {seller.email}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Allocated: {new Date(seller.allocated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded ${seller.allocation_status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {seller.allocation_status}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveSeller(seller.id)}
                                            disabled={removeMutation.isPending}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                            title="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Modal */}
            {showProgress && progress.total > 0 && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">Allocation Progress</h3>
                            {!isAllocating && (
                                <button
                                    onClick={handleCloseProgress}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Progress Bar */}
                            <div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">
                                        {progress.completed} / {progress.total} processed
                                    </span>
                                    <span className="font-medium">
                                        {Math.round((progress.completed / progress.total) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-green-600 mb-1">
                                        <CheckCircle2 size={16} />
                                        <span className="text-sm font-medium">Successful</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-900">{progress.successful}</p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-red-600 mb-1">
                                        <AlertCircle size={16} />
                                        <span className="text-sm font-medium">Failed</span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-900">{progress.failed}</p>
                                </div>
                            </div>

                            {/* Errors */}
                            {progress.errors.length > 0 && (
                                <div className="border rounded-lg max-h-48 overflow-y-auto">
                                    <div className="bg-red-50 border-b border-red-200 px-3 py-2">
                                        <p className="text-sm font-medium text-red-900 flex items-center gap-2">
                                            <AlertTriangle size={14} />
                                            Errors ({progress.errors.length})
                                        </p>
                                    </div>
                                    <div className="divide-y">
                                        {progress.errors.map((error, idx) => (
                                            <div key={idx} className="p-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {error.seller_name}
                                                </p>
                                                <p className="text-xs text-red-600 mt-1">
                                                    {error.error_code === 'SELLER_ALREADY_ALLOCATED'
                                                        ? 'Already allocated to this store'
                                                        : error.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            {isAllocating && (
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Allocating sellers...</span>
                                </div>
                            )}

                            {!isAllocating && progress.completed === progress.total && (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-green-600">
                                        ✓ Allocation complete!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllocateSellers;
