import { useQuery, useMutation } from '@tanstack/react-query';
import { AnalyticsFilter, SalesOverview, RevenuePoint, DailyMetric } from '../types/analytics';

export const useGetSalesOverview = (filter: AnalyticsFilter) => {
    return useQuery({
        queryKey: ['analytics-sales-overview', filter],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return {
                netRevenue: { value: 45231.89, trend: 12.5, isPositive: true },
                totalOrders: { value: 342, trend: 5.2, isPositive: true },
                avgOrderValue: { value: 132.25, trend: -2.1, isPositive: false }
            } as SalesOverview;
        }
    });
};

export const useGetRevenueByDay = (filter: AnalyticsFilter) => {
    return useQuery({
        queryKey: ['analytics-revenue-chart', filter],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            // Generate mock chart data based on range
            const days = filter.dateRange === '7d' ? 7 : filter.dateRange === '30d' ? 30 : 90;
            return Array.from({ length: days }).map((_, i) => ({
                date: new Date(Date.now() - (days - i) * 86400000).toISOString(),
                label: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: Math.floor(Math.random() * 5000) + 1000,
                orders: Math.floor(Math.random() * 50) + 5,
            })) as RevenuePoint[];
        }
    });
};

export const useGetSalesDaily = (filter: AnalyticsFilter) => {
    return useQuery({
        queryKey: ['analytics-sales-daily', filter],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 700));
            // Similar mapping but for table
            const days = filter.dateRange === '7d' ? 7 : filter.dateRange === '30d' ? 15 : 20; // limit rows
            return Array.from({ length: days }).map((_, i) => ({
                date: new Date(Date.now() - (days - i) * 86400000).toISOString(),
                orders: Math.floor(Math.random() * 50) + 5,
                grossSales: Math.floor(Math.random() * 6000) + 1200,
                returns: Math.floor(Math.random() * 200),
                netSales: Math.floor(Math.random() * 5000) + 1000,
            })) as DailyMetric[];
        }
    });
};

export const useExportSalesReport = () => {
    return useMutation({
        mutationFn: async (filter: AnalyticsFilter) => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { success: true, url: 'https://example.com/report.csv' };
        }
    });
};
