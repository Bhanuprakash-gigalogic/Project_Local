import React, { useState } from 'react';
import { Check, Search, User } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SellerSelectProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

// Mock mock sellers
const MOCK_SELLERS = [
    { id: '1', name: 'John Doe Electronics', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith Fashion', email: 'jane@example.com' },
    { id: '3', name: 'Best Gadgets Inc', email: 'sales@gadgets.com' },
    { id: '4', name: 'Organic Foods Ltd', email: 'info@organic.com' },
    { id: '5', name: 'Home Essentials', email: 'contact@home.com' },
];

const SellerSelect: React.FC<SellerSelectProps> = ({ onComplete, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredSellers = MOCK_SELLERS.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSeller = (id: string) => {
        setSelectedSellers(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        // Simulate allocation API
        await new Promise(r => setTimeout(r, 1000));
        setIsSubmitting(false);
        onComplete({ sellerIds: selectedSellers });
    };

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">Allocate Sellers</h3>
            <p className="text-sm text-gray-500 mb-6">
                Search for registered sellers and allocate them to your newly created stores.
            </p>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search sellers by name or email..."
                    className="pl-9 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md divide-y">
                {filteredSellers.map(seller => (
                    <div
                        key={seller.id}
                        className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${selectedSellers.includes(seller.id) ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleSeller(seller.id)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{seller.name}</p>
                                <p className="text-xs text-gray-500">{seller.email}</p>
                            </div>
                        </div>
                        <div className={`h-5 w-5 rounded border flex items-center justify-center ${selectedSellers.includes(seller.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                            {selectedSellers.includes(seller.id) && <Check size={12} className="text-white" />}
                        </div>
                    </div>
                ))}
                {filteredSellers.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                        No sellers found.
                    </div>
                )}
            </div>

            <div className="pt-4 flex justify-between items-center border-t mt-4">
                <span className="text-sm text-gray-600">
                    {selectedSellers.length} sellers selected
                </span>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleComplete}
                        disabled={isSubmitting || selectedSellers.length === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Allocating...' : 'Allocate Selected'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellerSelect;
