import React, { useState } from 'react';
import { useGetSellerApprovals, useGetSellerApprovalById } from '../hooks/useSellerApprovals';
import { SellerStatus } from '../types/seller';
import { SellerCard } from '../components/SellerCard';
import { SellerDetail } from '../components/SellerDetail';
import { Input } from '@/components/ui/Input';
import { SearchInput } from '@/components/ui/SearchInput';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Loader2 } from 'lucide-react';

const SellerApprovals = () => {
    // View State
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // List State
    const [status, setStatus] = useState<SellerStatus>('pending');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // Query List
    const { data: listData, isLoading: isListLoading } = useGetSellerApprovals({ status, search, page });

    // Query Detail (only when selected)
    const { data: detailData, isLoading: isDetailLoading } = useGetSellerApprovalById(selectedId);

    const handleSelectSeller = (id: string) => {
        setSelectedId(id);
        setView('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setView('list');
        setSelectedId(null);
    };

    const handleTabChange = (val: string) => {
        setStatus(val as SellerStatus);
        setPage(1);
    };

    if (view === 'detail') {
        if (isDetailLoading) {
            return (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }
        if (!detailData) return <div className="p-8 text-center">Seller not found</div>;

        return <SellerDetail application={detailData} onBack={handleBack} />;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Seller Approvals</h1>
                <p className="text-muted-foreground">Review and manage incoming seller applications.</p>
            </div>

            {/* Filter Bar */}
            <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4 bg-card">
                <Tabs value={status} onValueChange={handleTabChange} className="w-full md:w-auto">
                    <TabsList>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>
                <SearchInput
                    placeholder="Search applicant or business..."
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    className="w-full sm:w-[320px] bg-white"
                />
            </div>

            {/* List Content */}
            <div className="space-y-4 min-h-[400px]">
                {isListLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))
                ) : listData?.data.length === 0 ? (
                    <EmptyState
                        title="No Applications Found"
                        description={`No ${status} applications match your search.`}
                    />
                ) : (
                    listData?.data.map((app) => (
                        <SellerCard
                            key={app.id}
                            application={app}
                            onClick={handleSelectSeller}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {listData?.meta && listData.meta.totalPages > 1 && (
                <div className="flex justify-center pt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={listData.meta.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
};

export default SellerApprovals;
