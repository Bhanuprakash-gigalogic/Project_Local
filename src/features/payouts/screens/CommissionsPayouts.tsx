import React from 'react';
import { useGetPayoutOverview } from '../hooks/usePayouts';
import { CommissionSettings } from '../components/CommissionSettings';
import { PayoutHistory } from '../components/PayoutHistory';
import { MetricCard } from '@/components/ui/MetricCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { DollarSign, Clock, Calendar } from 'lucide-react';

const CommissionsPayouts = () => {
    const { data: overview, isLoading, error } = useGetPayoutOverview();

    if (error) {
        return <div className="p-8 text-destructive text-center">Failed to load payout overview.</div>;
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Commissions & Payouts</h1>
                <p className="text-muted-foreground">Manage vendor commissions and track payout history.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Paid Out"
                    value={isLoading ? "..." : `$${overview?.totalPaid.toLocaleString() ?? '0'}`}
                    icon={DollarSign}
                    trend={{ value: 12, isPositive: true }}
                    description="vs last month"
                />
                <MetricCard
                    title="Pending Payouts"
                    value={isLoading ? "..." : `$${overview?.pendingAmount.toLocaleString() ?? '0'}`}
                    icon={Clock}
                    description="Scheduled for processing"
                />
                <MetricCard
                    title="Next Batch"
                    value={isLoading ? "..." : (overview?.nextPayoutDate ? new Date(overview.nextPayoutDate).toLocaleDateString() : 'N/A')}
                    icon={Calendar}
                    description={overview?.avgProcessTime ? `Est. processing time: ${overview.avgProcessTime}` : ''}
                />
            </div>

            {/* Main Content Tabs */}
            <div className="mt-8">
                <Tabs defaultValue="history" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="history" className="px-8">Payout History</TabsTrigger>
                        <TabsTrigger value="settings" className="px-8">Commission Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="history">
                        <PayoutHistory />
                    </TabsContent>

                    <TabsContent value="settings">
                        <div className="max-w-3xl">
                            <CommissionSettings />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default CommissionsPayouts;
