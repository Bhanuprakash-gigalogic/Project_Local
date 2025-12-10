import React, { useState } from 'react';
import { useGetZoneAllocations, useAllocateToZone, useRemoveAllocation } from '../hooks/useZones';
import { ZoneAllocation } from '../types/zone';
import { Loader2, UserPlus, Trash2, Search, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface ZoneAllocationComponentProps {
    zoneId: string;
    zoneName: string;
}

// Mock seller search - replace with actual seller API
interface Seller {
    id: string;
    name: string;
    email: string;
}

const mockSellers: Seller[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com' },
];

const ZoneAllocationComponent: React.FC<ZoneAllocationComponentProps> = ({ zoneId, zoneName }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSellers, setSelectedSellers] = useState<Set<string>>(new Set());

    const { data: allocations, isLoading } = useGetZoneAllocations(zoneId);
    const allocateMutation = useAllocateToZone();
    const removeMutation = useRemoveAllocation();

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
        if (selectedSellers.size === 0) return;

        await allocateMutation.mutateAsync({
            zone_id: zoneId,
            seller_ids: Array.from(selectedSellers),
        });

        setSelectedSellers(new Set());
        setIsAddModalOpen(false);
        setSearchTerm('');
    };

    const handleRemove = async (allocationId: string) => {
        if (!confirm('Remove this seller from the zone?')) return;

        await removeMutation.mutateAsync({
            zone_id: zoneId,
            allocation_id: allocationId,
        });
    };

    const filteredSellers = mockSellers.filter(seller =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter out already allocated sellers
    const allocatedSellerIds = new Set(allocations?.allocations.map((a: ZoneAllocation) => a.seller_id) || []);
    const availableSellers = filteredSellers.filter(s => !allocatedSellerIds.has(s.id));

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Seller Allocations</h3>
                    <p className="text-sm text-gray-600">
                        Sellers assigned to {zoneName}
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                >
                    <UserPlus size={16} className="-ml-1 mr-2" />
                    Add Sellers
                </button>
            </div>

            {/* Allocations List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : allocations?.allocations.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 border border-dashed rounded-lg">
                    <p className="text-gray-600 mb-2">No sellers allocated yet</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-sm text-primary hover:underline"
                    >
                        Add your first seller
                    </button>
                </div>
            ) : (
                <div className="bg-white border rounded-lg divide-y">
                    {allocations?.allocations.map((allocation) => (
                        <div
                            key={allocation.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-50"
                        >
                            <div>
                                <p className="font-medium text-gray-900">
                                    {allocation.seller_name || `Seller ${allocation.seller_id}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Allocated {new Date(allocation.allocated_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleRemove(allocation.id)}
                                disabled={removeMutation.isPending}
                                className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                title="Remove allocation"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Sellers Modal */}
            <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
                        <div className="bg-white rounded-lg shadow-sm max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold">Add Sellers to Zone</h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 border-b">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search sellers..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {availableSellers.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        {searchTerm ? 'No sellers found' : 'All sellers are already allocated'}
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {availableSellers.map((seller) => (
                                            <label
                                                key={seller.id}
                                                className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSellers.has(seller.id)}
                                                    onChange={() => handleToggleSeller(seller.id)}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <div className="ml-3">
                                                    <p className="font-medium text-gray-900">{seller.name}</p>
                                                    <p className="text-sm text-gray-500">{seller.email}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                                <p className="text-sm text-gray-600">
                                    {selectedSellers.size} seller(s) selected
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAllocate}
                                        disabled={selectedSellers.size === 0 || allocateMutation.isPending}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {allocateMutation.isPending && (
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        )}
                                        Allocate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default ZoneAllocationComponent;
