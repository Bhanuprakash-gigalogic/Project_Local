import React, { useState } from 'react';
import { useGetSalesOverview, useGetRevenueByDay, useGetSalesDaily, useExportSalesReport } from '../hooks/useAnalytics';
import { AnalyticsFilter } from '../types/analytics';
import { RevenueChart } from '../components/RevenueChart';
import { DailyMetricsTable } from '../components/DailyMetricsTable';
import { MetricCard } from '@/components/ui/MetricCard';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const AnalyticsSales = () => {
    const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');
    const filter: AnalyticsFilter = { dateRange: range };

    const { addToast } = useToast();

    // Queries
    const { data: overview, isLoading: isOverviewLoading } = useGetSalesOverview(filter);
    const { data: chartData, isLoading: isChartLoading } = useGetRevenueByDay(filter);
    const { data: tableData, isLoading: isTableLoading } = useGetSalesDaily(filter);

    // Mutation
    const { mutate: exportReport, isPending: isExporting } = useExportSalesReport();

    const handleExport = () => {
        exportReport(filter, {
            onSuccess: () => addToast({ title: "Export Ready", description: "Report downloaded successfully.", type: "success" })
        });
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
                    <p className="text-muted-foreground">Monitor revenue and sales performance.</p>
                </div>
                <div className="bg-muted p-1 rounded-lg inline-flex">
                    {(['7d', '30d', '90d'] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${range === r ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Last {r.replace('d', ' Days')}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Net Revenue"
                    value={isOverviewLoading ? "..." : `$${overview?.netRevenue.value.toLocaleString()}`}
                    icon={DollarSign}
                    trend={{
                        value: overview?.netRevenue.trend || 0,
                        isPositive: overview?.netRevenue.isPositive ?? true
                    }}
                    description="vs previous period"
                />
                <MetricCard
                    title="Total Orders"
                    value={isOverviewLoading ? "..." : overview?.totalOrders.value.toString() || '0'}
                    icon={ShoppingBag}
                    trend={{
                        value: overview?.totalOrders.trend || 0,
                        isPositive: overview?.totalOrders.isPositive ?? true
                    }}
                    description="vs previous period"
                />
                <MetricCard
                    title="Avg. Order Value"
                    value={isOverviewLoading ? "..." : `$${overview?.avgOrderValue.value.toFixed(2)}`}
                    icon={TrendingUp}
                    trend={{
                        value: Math.abs(overview?.avgOrderValue.trend || 0),
                        isPositive: (overview?.avgOrderValue.trend || 0) > 0
                    }}
                    description="vs previous period"
                />
            </div>

            {/* Chart Section */}
            <RevenueChart data={chartData} isLoading={isChartLoading} />

            {/* Detailed Table */}
            <DailyMetricsTable
                data={tableData}
                isLoading={isTableLoading}
                onExport={handleExport}
                isExporting={isExporting}
            />
        </div>
    );
};

export default AnalyticsSales;
