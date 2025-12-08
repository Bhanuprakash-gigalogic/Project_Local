export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'failed';
export type CampaignChannel = 'push' | 'email' | 'sms';

export interface CampaignMetrics {
    sent: number;
    opened: number;
    clicked: number;
    openRate: number; // percentage
    clickRate: number; // percentage
}

export interface Campaign {
    id: string;
    title: string;
    description: string;
    channel: CampaignChannel;
    status: CampaignStatus;
    createdAt: string;
    sentAt?: string;
    scheduledAt?: string;
    metrics?: CampaignMetrics;
    content: {
        subject?: string; // for email
        body: string;
    };
}

export interface CampaignFilter {
    status?: CampaignStatus | 'all';
    search?: string;
    page?: number;
}

export interface PaginatedCampaigns {
    data: Campaign[];
    meta: {
        total: number;
        page: number;
        totalPages: number;
    };
}
