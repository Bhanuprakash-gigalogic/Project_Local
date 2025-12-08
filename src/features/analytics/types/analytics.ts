export interface AnalyticsFilter {
    dateRange: '7d' | '30d' | '90d' | 'custom';
    startDate?: string;
    endDate?: string;
}

export interface SalesOverview {
    netRevenue: {
        value: number;
        trend: number; // percentage
        isPositive: boolean;
    };
    totalOrders: {
        value: number;
        trend: number;
        isPositive: boolean;
    };
    avgOrderValue: {
        value: number;
        trend: number;
    };
}

export interface RevenuePoint {
    date: string; // ISO date
    label: string; // "Mon", "Week 1", etc
    revenue: number;
    orders: number;
}

export interface DailyMetric {
    date: string;
    orders: number;
    grossSales: number;
    returns: number;
    netSales: number;
}
