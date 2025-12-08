import React from 'react';
import { Campaign } from '../types/campaign';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Mail, Bell, MessageSquare, MoreVertical, Trash2, Copy, ChevronRight } from 'lucide-react';
import { useDeleteCampaign } from '../hooks/useCampaigns';
import { useToast } from '@/hooks/useToast';

interface CampaignCardProps {
    campaign: Campaign;
    onClick: (id: string) => void;
}

export const CampaignCard = ({ campaign, onClick }: CampaignCardProps) => {
    const { mutate: deleteCampaign } = useDeleteCampaign();
    const { addToast } = useToast();

    const getChannelIcon = () => {
        switch (campaign.channel) {
            case 'email': return <Mail size={20} className="text-blue-500" />;
            case 'push': return <Bell size={20} className="text-purple-500" />;
            case 'sms': return <MessageSquare size={20} className="text-green-500" />;
        }
    };

    const getStatusVariant = () => {
        switch (campaign.status) {
            case 'sent': return 'success';
            case 'scheduled': return 'default';
            case 'draft': return 'secondary';
            case 'failed': return 'destructive';
            default: return 'outline';
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this campaign?')) {
            deleteCampaign(campaign.id, {
                onSuccess: () => addToast({ title: "Campaign Deleted", description: "", type: "success" })
            });
        }
    };

    const getDateDisplay = () => {
        if (campaign.sentAt) {
            return `Sent ${new Date(campaign.sentAt).toLocaleDateString()}`;
        }
        if (campaign.scheduledAt) {
            return `Scheduled for ${new Date(campaign.scheduledAt).toLocaleDateString()}`;
        }
        return `Created ${new Date(campaign.createdAt).toLocaleDateString()}`;
    };

    return (
        <Card
            className="cursor-pointer hover:border-primary/50 transition-all group"
            onClick={() => onClick(campaign.id)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1">{getChannelIcon()}</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{campaign.title}</h3>
                            <p className="text-sm text-muted-foreground truncate mt-1">{campaign.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge variant={getStatusVariant()} className="capitalize">
                                    {campaign.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{getDateDisplay()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleDelete}
                        >
                            <Trash2 size={16} />
                        </Button>
                        <ChevronRight className="text-muted-foreground" size={20} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
