import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SellerApplication, SellerFilter, SellerStatus } from '../types/seller';

// Mock Data Generator
const generateMockSellers = (count: number): SellerApplication[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `sel-${i + 1}`,
        applicantName: `Applicant ${i + 1}`,
        email: `seller${i + 1}@business.com`,
        businessName: `Enterprises ${i + 1} LLC`,
        businessType: i % 2 === 0 ? 'Retail' : 'Wholesale',
        phone: `+1 555-01${(i + 1).toString().padStart(2, '0')}`,
        status: i % 5 === 0 ? 'approved' : i % 7 === 0 ? 'rejected' : 'pending',
        avatar: `https://i.pravatar.cc/150?u=${i + 100}`,
        submittedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
        documents: [
            { id: 'd1', name: 'Business License', type: 'license', url: '#', uploadedAt: new Date().toISOString() },
            { id: 'd2', name: 'Tax ID Proof', type: 'tax', url: '#', uploadedAt: new Date().toISOString() }
        ],
        address: {
            street: `${i * 10} Market St`,
            city: 'San Francisco',
            state: 'CA',
            zip: '94103',
            country: 'USA'
        }
    }));
};

const MOCK_SELLERS = generateMockSellers(30);

export const useGetSellerApprovals = (filter: SellerFilter) => {
    return useQuery({
        queryKey: ['seller-approvals', filter],
        queryFn: async () => {
            // Simulate API
            await new Promise(resolve => setTimeout(resolve, 800));

            let filtered = MOCK_SELLERS.filter(s => s.status === filter.status);

            if (filter.search) {
                const q = filter.search.toLowerCase();
                filtered = filtered.filter(s =>
                    s.businessName.toLowerCase().includes(q) ||
                    s.applicantName.toLowerCase().includes(q)
                );
            }

            return {
                data: filtered,
                meta: {
                    total: filtered.length,
                    page: filter.page || 1,
                    totalPages: Math.ceil(filtered.length / 10)
                }
            };
        }
    });
};

export const useGetSellerApprovalById = (id: string | null) => {
    return useQuery({
        queryKey: ['seller-approval', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return MOCK_SELLERS.find(s => s.id === id) || null;
        },
        enabled: !!id
    });
};

export const useApproveSeller = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Simulate update
            const idx = MOCK_SELLERS.findIndex(s => s.id === id);
            if (idx > -1) MOCK_SELLERS[idx].status = 'approved';
            return { id, status: 'approved' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['seller-approval'] });
        }
    });
};

export const useRejectSeller = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Simulate update
            const idx = MOCK_SELLERS.findIndex(s => s.id === id);
            if (idx > -1) {
                MOCK_SELLERS[idx].status = 'rejected';
                MOCK_SELLERS[idx].rejectionReason = reason;
            }
            return { id, status: 'rejected' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['seller-approval'] });
        }
    });
};
