import React, { useState } from 'react';
import { useGetRefunds, useGetRefundById } from '../hooks/useRefunds';
import { RefundStatus } from '../types/refund';
import { RefundCard } from '../components/RefundCard';
import { RefundDetail } from '../components/RefundDetail';
import { SearchInput } from '@/components/ui/SearchInput';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader2 } from 'lucide-react';

const RefundsList = () => {
    // View State
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Filter Logic
    const [status, setStatus] = useState<RefundStatus | 'all'>('all');
    const [search, setSearch] = useState('');

    // Queries
    const { data: listData, isLoading: isListLoading } = useGetRefunds({ status, search });
    const { data: detailData, isLoading: isDetailLoading } = useGetRefundById(selectedId);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        setView('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setSelectedId(null);
        setView('list');
    };

    if (view === 'detail') {
        if (isDetailLoading) return (
            <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
        if (!detailData) return <div className="text-center p-8">Refund request not found.</div>;
        return <RefundDetail refund={detailData} onBack={handleBack} />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Refunds & Returns</h1>
                <p className="text-muted-foreground">Manage refund requests and process potential returns.</p>
            </div>

            <div className="p-3 md:p-4 border-b flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4 bg-card">
                <Tabs value={status} onValueChange={(v) => setStatus(v as RefundStatus)} className="w-full md:w-auto">
                    <TabsList className="grid grid-cols-4 w-full md:w-auto md:inline-flex gap-2">
                        <TabsTrigger value="all" className="text-xs md:text-sm px-3 md:px-5">All</TabsTrigger>
                        <TabsTrigger value="pending" className="text-xs md:text-sm px-3 md:px-5">Pending</TabsTrigger>
                        <TabsTrigger value="approved" className="text-xs md:text-sm px-3 md:px-5">Approved</TabsTrigger>
                        <TabsTrigger value="rejected" className="text-xs md:text-sm px-3 md:px-5">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>
                <SearchInput
                    placeholder="Search refund ID, order, or customer..."
                    onSearch={setSearch}
                    className="w-full md:w-[300px]"
                />
            </div>

            <div className="space-y-4 min-h-[400px]">
                {isListLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-[200px]" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                        </div>
                    ))
                ) : listData?.data.length === 0 ? (
                    <EmptyState
                        title="No Refunds Found"
                        description="No refund requests match your current filters."
                    />
                ) : (
                    listData?.data.map((refund) => (
                        <RefundCard key={refund.id} refund={refund} onClick={handleSelect} />
                    ))
                )}
            </div>
        </div>
    );
};

export default RefundsList;
