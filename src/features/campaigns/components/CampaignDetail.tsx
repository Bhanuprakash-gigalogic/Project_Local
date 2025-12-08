import React, { useState } from 'react';
import { Campaign } from '../types/campaign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useSendCampaign, useScheduleCampaign } from '../hooks/useCampaigns';
import { useToast } from '@/hooks/useToast';
import { X, Send, Calendar, Mail, Bell, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface CampaignDetailProps {
    campaign?: Campaign;
    isLoading: boolean;
    onClose: () => void;
}

export const CampaignDetail = ({ campaign, isLoading, onClose }: CampaignDetailProps) => {
    const [scheduleDate, setScheduleDate] = useState('');
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    const { mutate: sendCampaign, isPending: isSending } = useSendCampaign();
    const { mutate: scheduleCampaign, isPending: isScheduling } = useScheduleCampaign();
    const { addToast } = useToast();

    const handleSend = () => {
        if (!campaign) return;
        sendCampaign(campaign.id, {
            onSuccess: () => {
                addToast({ title: "Campaign Sent", description: "Your campaign is being delivered.", type: "success" });
                onClose();
            }
        });
    };

    const handleSchedule = () => {
        if (!campaign || !scheduleDate) return;
        scheduleCampaign({ id: campaign.id, scheduledAt: new Date(scheduleDate).toISOString() }, {
            onSuccess: () => {
                addToast({ title: "Campaign Scheduled", description: "", type: "success" });
                setShowScheduleModal(false);
                onClose();
            }
        });
    };

    const getChannelIcon = () => {
        if (!campaign) return null;
        switch (campaign.channel) {
            case 'email': return <Mail className="text-blue-500" />;
            case 'push': return <Bell className="text-purple-500" />;
            case 'sms': return <MessageSquare className="text-green-500" />;
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-background border-l shadow-xl z-50 overflow-y-auto">
                <div className="p-6 space-y-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    if (!campaign) return null;

    return (
        <>
            <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-background border-l shadow-xl z-50 overflow-y-auto animate-in slide-in-from-right">
                <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        {getChannelIcon()}
                        <h2 className="text-xl font-semibold">{campaign.title}</h2>
                    </div>
                    <Button size="icon" variant="ghost" onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status & Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Campaign Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={campaign.status === 'sent' ? 'success' : 'secondary'} className="capitalize">
                                    {campaign.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Channel</span>
                                <span className="text-sm font-medium capitalize">{campaign.channel}</span>
                            </div>
                            {campaign.sentAt && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Sent At</span>
                                    <span className="text-sm">{new Date(campaign.sentAt).toLocaleString()}</span>
                                </div>
                            )}
                            {campaign.scheduledAt && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Scheduled For</span>
                                    <span className="text-sm">{new Date(campaign.scheduledAt).toLocaleString()}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metrics (if sent) */}
                    {campaign.metrics && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-2xl font-bold">{campaign.metrics.sent.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">Sent</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{campaign.metrics.opened.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">Opened ({campaign.metrics.openRate.toFixed(1)}%)</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{campaign.metrics.clicked.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">Clicked ({campaign.metrics.clickRate.toFixed(1)}%)</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Content Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {campaign.content.subject && (
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Subject</div>
                                    <div className="font-medium">{campaign.content.subject}</div>
                                </div>
                            )}
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Message</div>
                                <div className="text-sm whitespace-pre-wrap">{campaign.content.body}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {campaign.status === 'draft' && (
                        <div className="flex gap-3">
                            <Button onClick={handleSend} isLoading={isSending} className="flex-1">
                                <Send className="mr-2 h-4 w-4" /> Send Now
                            </Button>
                            <Button variant="outline" onClick={() => setShowScheduleModal(true)} className="flex-1">
                                <Calendar className="mr-2 h-4 w-4" /> Schedule
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Modal */}
            <Modal open={showScheduleModal} onOpenChange={setShowScheduleModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Schedule Campaign</ModalTitle>
                        <ModalDescription>Choose when to send this campaign</ModalDescription>
                    </ModalHeader>
                    <div className="py-4">
                        <Input
                            type="datetime-local"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                        <Button onClick={handleSchedule} isLoading={isScheduling} disabled={!scheduleDate}>
                            Schedule
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        </>
    );
};
