import React, { useState } from 'react';
import { useGetPendingProducts, useGetProductApprovalById } from '../hooks/useProductApprovals';
import { ProductStatus } from '../types/product';
import { ProductApprovalCard } from '../components/ProductApprovalCard';
import { ProductApprovalDetail } from '../components/ProductApprovalDetail';
import { SearchInput } from '@/components/ui/SearchInput';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button'; // Import Button if needed for header actions
import { Loader2 } from 'lucide-react';

const ProductApprovals = () => {
    // View Management
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Filter Logic
    const [status, setStatus] = useState<ProductStatus>('pending');
    const [search, setSearch] = useState('');

    // Queries
    const { data: listData, isLoading: isListLoading } = useGetPendingProducts({ status, search });
    const { data: detailData, isLoading: isDetailLoading } = useGetProductApprovalById(selectedId);

    const handleSelectProduct = (id: string) => {
        setSelectedId(id);
        setView('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setSelectedId(null);
        setView('list');
    };

    const handleTabChange = (val: string) => {
        setStatus(val as ProductStatus);
    };

    // Detail View Render
    if (view === 'detail') {
        if (isDetailLoading) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }
        if (!detailData) return <div className="p-8 text-center">Product not found.</div>;
        return <ProductApprovalDetail product={detailData} onBack={handleBack} />;
    }

    // List View Render
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Product Approvals</h1>
                <p className="text-muted-foreground">Review and moderate user-submitted products.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-16 bg-muted/40 p-1 backdrop-blur-sm z-10 rounded-lg">
                <Tabs value={status} onValueChange={handleTabChange} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="pending" className="px-6">Pending</TabsTrigger>
                        <TabsTrigger value="active" className="px-6">Approved</TabsTrigger>
                        <TabsTrigger value="rejected" className="px-6">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>
                <SearchInput
                    placeholder="Search products or sellers..."
                    onSearch={setSearch}
                    className="w-full sm:w-[320px] bg-background"
                />
            </div>

            {/* Product List */}
            <div className="space-y-4 min-h-[400px]">
                {isListLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))
                ) : listData?.data.length === 0 ? (
                    <EmptyState
                        title="No Products Found"
                        description={`No ${status} products match your search.`}
                    />
                ) : (
                    listData?.data.map((product) => (
                        <ProductApprovalCard
                            key={product.id}
                            product={product}
                            onClick={handleSelectProduct}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {listData && listData.meta.totalPages > 1 && (
                <div className="flex justify-center pt-6">
                    <Pagination
                        currentPage={listData.meta.page}
                        totalPages={listData.meta.totalPages}
                        onPageChange={() => { }} // Hook up if we add page state
                    />
                </div>
            )}
        </div>
    );
};

export default ProductApprovals;
