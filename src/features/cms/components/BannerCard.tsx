import React from 'react';
import { Banner } from '../types/cms';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MoreVertical, Globe, EyeOff, Trash2 } from 'lucide-react';
import { usePublishBanner, useDeleteBanner } from '../hooks/useCms';
import { useToast } from '@/hooks/useToast';

interface BannerCardProps {
    banner: Banner;
}

export const BannerCard = ({ banner }: BannerCardProps) => {
    const { mutate: publish } = usePublishBanner();
    const { mutate: deleteBanner } = useDeleteBanner();
    const { addToast } = useToast();

    // Simplified menu for demo - in real app, use DropdownMenu
    const toggleStatus = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = banner.status === 'live' ? 'draft' : 'live';
        publish({ id: banner.id, status: newStatus }, {
            onSuccess: () => addToast({ title: `Banner ${newStatus === 'live' ? 'Published' : 'Unpublished'}`, type: "success" })
        });
            <div className="relative h-32 w-full bg-muted/20">
                <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    <Button size="icon" variant="secondary" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={toggleStatus}>
                        {banner.status === 'live' ? <EyeOff size={14} /> : <Globe size={14} />}
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleDelete}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>
            <CardContent className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold truncate pr-2">{banner.title}</h3>
                    <Badge variant={banner.status === 'live' ? 'success' : 'secondary'}>{banner.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{banner.linkUrl}</p>
            </CardContent>
        </Card >
    );
};
