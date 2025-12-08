import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Payout, PayoutStatus, PayoutFilter, CommissionSettings, VendorCommission } from '../types/payout';

// Mock Data
let MOCK_SETTINGS: CommissionSettings = {
    defaultRate: 10,
    allowVendorSpecific: true,
    vendorRates: [
        { vendorId: 'v1', vendorName: 'Premium Tech Store', rate: 8 },
        { vendorId: 'v2', vendorName: 'Fashion Hub', rate: 12 }
    ]
};

const generateMockPayouts = (count: number): Payout[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `pay-${i + 1}`,
        vendorId: `v${i % 5}`,
        vendorName: i % 5 === 0 ? 'Premium Tech Store' : i % 5 === 1 ? 'Fashion Hub' : `Vendor ${i}`,
        vendorEmail: `vendor${i}@example.com`,
        amount: 150.00 + (i * 25.50),
        status: i % 10 === 0 ? 'failed' : i % 5 === 0 ? 'pending' : 'completed',
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        orderId: `ORD-${3000 + i}`
    }));
};

let MOCK_PAYOUTS = generateMockPayouts(40);

export const useGetCommissionSettings = () => {
    return useQuery({
        queryKey: ['commission-settings'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return MOCK_SETTINGS;
        }
    });
};

export const useUpdateCommissionSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (settings: CommissionSettings) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            MOCK_SETTINGS = settings;
            return settings;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commission-settings'] });
        }
    });
};

export const useGetPayoutOverview = () => {
    return useQuery({
        queryKey: ['payout-overview'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            const totalPaid = MOCK_PAYOUTS.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
            const pending = MOCK_PAYOUTS.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
            return {
                totalPaid,
                pendingAmount: pending,
                avgProcessTime: '48 Hours',
                nextPayoutDate: new Date(Date.now() + 86400000 * 2).toISOString()
            };
        }
    });
};

export const useGetPayoutHistory = (filter: PayoutFilter) => {
    return useQuery({
        queryKey: ['payout-history', filter],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 800));

            let filtered = MOCK_PAYOUTS;

            if (filter.status && filter.status !== 'all') {
                filtered = filtered.filter(p => p.status === filter.status);
            }

            if (filter.search) {
                const q = filter.search.toLowerCase();
                filtered = filtered.filter(p => p.vendorName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
            }

            // Sort by date desc
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const page = filter.page || 1;
            const limit = 10;
            const start = (page - 1) * limit;

            return {
                data: filtered.slice(start, start + limit),
                meta: {
                    total: filtered.length,
                    page,
                    totalPages: Math.ceil(filtered.length / limit)
                }
            };
        }
    });
};

export const useRetryPayout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const idx = MOCK_PAYOUTS.findIndex(p => p.id === id);
            if (idx > -1) {
                MOCK_PAYOUTS[idx].status = 'processing';
            }
            return { id, status: 'processing' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payout-history'] });
            queryClient.invalidateQueries({ queryKey: ['payout-overview'] });
        }
    });
};
