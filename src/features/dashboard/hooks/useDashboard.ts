import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../lib/axios';

// --- Types ---
export interface DashboardSummary {
    gmv: { value: number; trend: number };
    totalOrders: { value: number; trend: number };
    activeUsers: { value: number; trend: number };
    activeSellers: { value: number; trend: number };
}

export interface SalesTrendData {
    label: string;
    revenue: number;
}

export interface TopProduct {
    id: string;
    name: string;
    image: string;
    unitsSold: number;
    revenue: number;
}

export interface LowInventoryProduct {
    id: string;
    name: string;
    stock: number;
    threshold: number;
}

// --- Mock Data Generators (for demo purposes if API fails or for initial dev) ---
const mockSummary: DashboardSummary = {
    gmv: { value: 125000, trend: 12.5 },
    totalOrders: { value: 3450, trend: 8.2 },
    activeUsers: { value: 1205, trend: -2.4 },
    activeSellers: { value: 450, trend: 5.1 },
};

const mockSalesTrend: SalesTrendData[] = [
    { label: 'W1', revenue: 4000 },
    { label: 'W2', revenue: 3000 },
    { label: 'W3', revenue: 5000 },
    { label: 'W4', revenue: 4500 },
    { label: 'W5', revenue: 6000 },
    { label: 'W6', revenue: 5500 },
    { label: 'W7', revenue: 7000 },
    { label: 'W8', revenue: 8000 },
    { label: 'W9', revenue: 7500 },
    { label: 'W10', revenue: 9000 },
    { label: 'W11', revenue: 8500 },
    { label: 'W12', revenue: 10000 },
];

const mockTopProducts: TopProduct[] = [
    { id: '1', name: 'Wireless Headphones', image: 'https://placehold.co/40', unitsSold: 1200, revenue: 24000 },
    { id: '2', name: 'Smart Watch', image: 'https://placehold.co/40', unitsSold: 850, revenue: 34000 },
    { id: '3', name: 'Bluetooth Speaker', image: 'https://placehold.co/40', unitsSold: 600, revenue: 18000 },
    { id: '4', name: 'Laptop Stand', image: 'https://placehold.co/40', unitsSold: 450, revenue: 9000 },
    { id: '5', name: 'USB-C Cable', image: 'https://placehold.co/40', unitsSold: 2000, revenue: 10000 },
];

const mockLowInventory: LowInventoryProduct[] = [
    { id: '101', name: 'Ergonomic Mouse', stock: 5, threshold: 10 },
    { id: '102', name: 'Mechanical Keyboard', stock: 2, threshold: 15 },
    { id: '103', name: 'Monitor Arm', stock: 0, threshold: 5 },
];


// --- Hooks ---

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ['dashboard', 'summary'],
        queryFn: async () => {
            // In a real app: return (await axiosInstance.get<DashboardSummary>('/dashboard/summary')).data;
            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return mockSummary;
        }
    });
};

export const useSalesTrend = (range: string) => {
    return useQuery({
        queryKey: ['dashboard', 'salesTrend', range],
        queryFn: async () => {
            // In a real app: return (await axiosInstance.get<SalesTrendData[]>('/analytics/sales/revenue-by-day', { params: { range } })).data;
            await new Promise(resolve => setTimeout(resolve, 1200));
            return mockSalesTrend;
        }
    });
};

export const useTopSellingProducts = (range: string) => {
    return useQuery({
        queryKey: ['dashboard', 'topProducts', range],
        queryFn: async () => {
            // In a real app: return (await axiosInstance.get<TopProduct[]>('/analytics/products/top-selling', { params: { range } })).data;
            await new Promise(resolve => setTimeout(resolve, 1500));
            return mockTopProducts;
        }
    });
};

export const useLowInventory = () => {
    return useQuery({
        queryKey: ['dashboard', 'lowInventory'],
        queryFn: async () => {
            // In a real app: return (await axiosInstance.get<LowInventoryProduct[]>('/analytics/inventory/low')).data;
            await new Promise(resolve => setTimeout(resolve, 800));
            return mockLowInventory;
        }
    });
};
