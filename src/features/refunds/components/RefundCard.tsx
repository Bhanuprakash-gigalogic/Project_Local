import React from 'react';
import { RefundRequest } from '../types/refund';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, PackageX, User } from 'lucide-react';

interface RefundCardProps {
    refund: RefundRequest;
    onClick: (id: string) => void;
}

export const RefundCard = ({ refund, onClick }: RefundCardProps) => {
    const statusVariant =
        refund.status === 'completed' ? 'success' :
            refund.status === 'approved' ? 'default' :
                refund.status === 'rejected' ? 'destructive' :
                    'warning';

    return (
        <Card
            className="cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => onClick(refund.id)}
        >
            <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                    <PackageX size={20} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{refund.id}</h3>
                        <Badge variant={statusVariant} className="capitalize">{refund.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <User size={14} /> {refund.customerName}
                        </span>
                        <span>
                            Amount: <span className="text-foreground font-medium">${refund.amount.toFixed(2)}</span>
                        </span>
                        <span className="hidden sm:inline">
                            Req: {new Date(refund.requestedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronRight />
                </div>
            </CardContent>
        </Card>
    );
};
