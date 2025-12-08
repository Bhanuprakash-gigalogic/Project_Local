import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefundRequest, RefundFilter, RefundStatus } from '../types/refund';

// Mock Data
const generateMockRefunds = (count: number): RefundRequest[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `ref-${i + 1}`,
        orderId: `ORD-${(2000 + i).toString()}`,
        customerName: `Customer ${i + 1}`,
        customerEmail: `cust${i}@example.com`,
        amount: 29.99 + (i * 5),
        status: i % 4 === 0 ? 'pending' : i % 4 === 1 ? 'approved' : i % 4 === 2 ? 'rejected' : 'completed',
        reason: i % 3 === 0 ? 'Damaged Item' : i % 3 === 1 ? 'Wrong Size' : 'Changed Mind',
        description: "The item arrived with a scratch on the surface and I would like a replacement or a refund.",
        images: [
            `https://placehold.co/400x300?text=Evidence+${i + 1}`,
            `https://placehold.co/400x300?text=Box+${i + 1}`
        ],
        items: [
            {
                id: `item-${i}`,
                productId: `prod-${i}`,
                productName: `Product ${i + 1}`,
                productImage: `https://placehold.co/100?text=Prod+${i + 1}`,
                quantity: 1,
                amount: 29.99 + (i * 5)
            }
        ],
        requestedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }));
};

const MOCK_REFUNDS = generateMockRefunds(30);

export const useGetRefunds = (filter: RefundFilter) => {
    return useQuery({
        queryKey: ['refunds', filter],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 800));

            let filtered = MOCK_REFUNDS;

            if (filter.status && filter.status !== 'all') {
                filtered = filtered.filter(r => r.status === filter.status);
            }

            if (filter.search) {
                const q = filter.search.toLowerCase();
                filtered = filtered.filter(r =>
                    r.id.toLowerCase().includes(q) ||
                    r.customerName.toLowerCase().includes(q) ||
                    r.orderId.toLowerCase().includes(q)
                );
            }

            return {
                data: filtered,
                meta: {
                    total: filtered.length,
                    page: 1,
                    totalPages: Math.ceil(filtered.length / 10)
                }
            };
        }
    });
};

export const useGetRefundById = (id: string | null) => {
    return useQuery({
        queryKey: ['refund', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return MOCK_REFUNDS.find(r => r.id === id) || null;
        },
        enabled: !!id
    });
};

export const useApproveRefund = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const idx = MOCK_REFUNDS.findIndex(r => r.id === id);
            if (idx > -1) {
                MOCK_REFUNDS[idx].status = 'approved';
                MOCK_REFUNDS[idx].processedAt = new Date().toISOString();
            }
            return { id, status: 'approved' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['refunds'] });
            queryClient.invalidateQueries({ queryKey: ['refund'] });
        }
    });
};

export const useRejectRefund = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const idx = MOCK_REFUNDS.findIndex(r => r.id === id);
            if (idx > -1) {
                MOCK_REFUNDS[idx].status = 'rejected';
                MOCK_REFUNDS[idx].rejectionReason = reason;
                MOCK_REFUNDS[idx].processedAt = new Date().toISOString();
            }
            return { id, status: 'rejected' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['refunds'] });
            queryClient.invalidateQueries({ queryKey: ['refund'] });
        }
    });
};

export const useCompleteRefund = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const idx = MOCK_REFUNDS.findIndex(r => r.id === id);
            if (idx > -1) {
                MOCK_REFUNDS[idx].status = 'completed';
            }
            return { id, status: 'completed' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['refunds'] });
            queryClient.invalidateQueries({ queryKey: ['refund'] });
        }
    });
};
