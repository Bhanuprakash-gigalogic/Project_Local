import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Campaign, CampaignStatus, CampaignChannel, CampaignFilter } from '../types/campaign';

// Mock Data
const generateMockCampaigns = (count: number): Campaign[] => {
    const channels: CampaignChannel[] = ['push', 'email', 'sms'];
    const statuses: CampaignStatus[] = ['draft', 'scheduled', 'sent', 'failed'];

    return Array.from({ length: count }).map((_, i) => {
        const status = statuses[i % statuses.length];
        const channel = channels[i % channels.length];

        return {
            id: `camp-${i + 1}`,
            title: `Campaign ${i + 1}`,
            description: `Special offer for ${channel} subscribers`,
            channel,
            status,
            createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            sentAt: status === 'sent' ? new Date(Date.now() - Math.random() * 5000000000).toISOString() : undefined,
            scheduledAt: status === 'scheduled' ? new Date(Date.now() + Math.random() * 5000000000).toISOString() : undefined,
            metrics: status === 'sent' ? {
                sent: 1000 + Math.floor(Math.random() * 5000),
                opened: 500 + Math.floor(Math.random() * 2000),
                clicked: 100 + Math.floor(Math.random() * 500),
                openRate: 40 + Math.random() * 30,
                clickRate: 10 + Math.random() * 20,
            } : undefined,
            content: {
                subject: channel === 'email' ? `Special Offer ${i + 1}` : undefined,
                body: `Check out our amazing deals!`,
            }
        };
    });
};

let MOCK_CAMPAIGNS = generateMockCampaigns(25);

export const useGetCampaigns = (filter: CampaignFilter) => {
    return useQuery({
        queryKey: ['campaigns', filter],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 700));

            let filtered = MOCK_CAMPAIGNS;

            if (filter.status && filter.status !== 'all') {
                filtered = filtered.filter(c => c.status === filter.status);
            }

            if (filter.search) {
                const q = filter.search.toLowerCase();
                filtered = filtered.filter(c =>
                    c.title.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q)
                );
            }

            // Sort by date desc
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

export const useGetCampaignById = (id: string) => {
    return useQuery({
        queryKey: ['campaign', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_CAMPAIGNS.find(c => c.id === id);
        },
        enabled: !!id
    });
};

export const useCreateCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Partial<Campaign>) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const newCampaign: Campaign = {
                id: `camp-${Date.now()}`,
                title: payload.title || 'New Campaign',
                description: payload.description || '',
                channel: payload.channel || 'push',
                status: 'draft',
                createdAt: new Date().toISOString(),
                content: payload.content || { body: '' }
            };
            MOCK_CAMPAIGNS.unshift(newCampaign);
            return newCampaign;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        }
    });
};

export const useUpdateCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: Partial<Campaign> }) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const idx = MOCK_CAMPAIGNS.findIndex(c => c.id === id);
            if (idx > -1) {
                MOCK_CAMPAIGNS[idx] = { ...MOCK_CAMPAIGNS[idx], ...payload };
                return MOCK_CAMPAIGNS[idx];
            }
            throw new Error('Campaign not found');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign'] });
        }
    });
};

export const useSendCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const idx = MOCK_CAMPAIGNS.findIndex(c => c.id === id);
            if (idx > -1) {
                MOCK_CAMPAIGNS[idx].status = 'sent';
                MOCK_CAMPAIGNS[idx].sentAt = new Date().toISOString();
                MOCK_CAMPAIGNS[idx].metrics = {
                    sent: 1000,
                    opened: 0,
                    clicked: 0,
                    openRate: 0,
                    clickRate: 0
                };
                return MOCK_CAMPAIGNS[idx];
            }
            throw new Error('Campaign not found');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign'] });
        }
    });
};

export const useScheduleCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, scheduledAt }: { id: string; scheduledAt: string }) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const idx = MOCK_CAMPAIGNS.findIndex(c => c.id === id);
            if (idx > -1) {
                MOCK_CAMPAIGNS[idx].status = 'scheduled';
                MOCK_CAMPAIGNS[idx].scheduledAt = scheduledAt;
                return MOCK_CAMPAIGNS[idx];
            }
            throw new Error('Campaign not found');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign'] });
        }
    });
};

export const useDeleteCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            MOCK_CAMPAIGNS = MOCK_CAMPAIGNS.filter(c => c.id !== id);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        }
    });
};
