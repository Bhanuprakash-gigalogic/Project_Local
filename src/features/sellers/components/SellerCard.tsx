import React from 'react';
import { SellerApplication } from '../types/seller';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';

interface SellerCardProps {
    application: SellerApplication;
    onClick: (id: string) => void;
}

export const SellerCard = ({ application, onClick }: SellerCardProps) => {
    const statusVariant =
        application.status === 'approved' ? 'success' :
            application.status === 'rejected' ? 'destructive' : 'warning';

    return (
        <Card
            className="cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => onClick(application.id)}
        >
            <CardContent className="p-4 flex items-center gap-4">
                {/* Avatar Area */}
                <div className="h-12 w-12 rounded-full overflow-hidden border bg-secondary flex-shrink-0">
                    <img src={application.avatar} alt={application.businessName} className="h-full w-full object-cover" />
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate pr-2">{application.businessName}</h3>
                        <Badge variant={statusVariant} className="capitalize hidden sm:inline-flex">
                            {application.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-1">
                        {application.applicantName} • {application.businessType}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground gap-3">
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span className="truncate max-w-[150px]">{application.address.city}, {application.address.state}</span>
                        </div>
                    </div>
                    {/* Mobile Badge */}
                    <div className="mt-2 sm:hidden">
                        <Badge variant={statusVariant} className="capitalize">{application.status}</Badge>
                    </div>
                </div>

                {/* Action Area */}
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronRight />
                </div>
            </CardContent>
        </Card>
    );
};
