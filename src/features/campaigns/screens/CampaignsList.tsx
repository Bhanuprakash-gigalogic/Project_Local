import React, { useState } from 'react';
import { useGetCampaigns, useGetCampaignById } from '../hooks/useCampaigns';
import { CampaignStatus } from '../types/campaign';
import { CampaignCard } from '../components/CampaignCard';
import { CampaignDetail } from '../components/CampaignDetail';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus } from 'lucide-react';

const CampaignsList = () => {
    const [status, setStatus] = useState<CampaignStatus | 'all'>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data, isLoading } = useGetCampaigns({ status, search, page });
    const { data: selectedCampaign, isLoading: isDetailLoading } = useGetCampaignById(selectedId || '');

    const handleSelectCampaign = (id: string) => {
        setSelectedId(id);
    };

    const handleCloseDetail = () => {
        setSelectedId(null);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-muted-foreground">Manage notification campaigns across all channels.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Campaign
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={status} onValueChange={(v) => { setStatus(v as CampaignStatus | 'all'); setPage(1); }}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Search */}
            <SearchInput
                placeholder="Search campaigns..."
                onSearch={(val) => { setSearch(val); setPage(1); }}
                className="w-full md:w-[400px]"
            />

            {/* Campaign List */}
            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))
                ) : data?.data.length === 0 ? (
                    <EmptyState
                        title="No Campaigns Found"
                        description="Create your first campaign to get started."
                    />
                ) : (
                    data?.data.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            onClick={handleSelectCampaign}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {data && data.meta.totalPages > 1 && (
                <div className="flex justify-center pt-4">
                    <Pagination
                        currentPage={data.meta.page}
                        totalPages={data.meta.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {/* Detail Panel */}
            {selectedId && (
                <CampaignDetail
                    campaign={selectedCampaign}
                    isLoading={isDetailLoading}
                    onClose={handleCloseDetail}
                />
            )}
        </div>
    );
};

export default CampaignsList;
