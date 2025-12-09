import React from 'react';
import { Product } from '../types/product';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, Calendar, Store } from 'lucide-react';

interface ProductApprovalCardProps {
    product: Product;
    onClick: (id: string) => void;
}

export const ProductApprovalCard = ({ product, onClick }: ProductApprovalCardProps) => {
    const statusVariant =
        product.status === 'active' ? 'success' :
            product.status === 'rejected' ? 'destructive' :
                'warning';

    const primaryImg = product.images.find(img => img.isPrimary) || product.images[0];

    return (
        <Card
            className="cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => onClick(product.id)}
        >
            <CardContent className="p-4 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="h-16 w-16 bg-secondary rounded-md overflow-hidden flex-shrink-0 border">
                    {primaryImg && <img src={primaryImg.url} alt={product.title} className="h-full w-full object-cover" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate pr-2" title={product.title}>{product.title}</h3>
                        <Badge variant={statusVariant} className="capitalize hidden sm:inline-flex">{product.status}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-x-2 gap-y-1">
                        <span className="flex items-center gap-1 truncate max-w-[120px] sm:max-w-none">
                            <Store size={12} className="flex-shrink-0" />
                            <span className="truncate">{product.seller.businessName}</span>
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                            <Calendar size={12} /> {new Date(product.submittedAt).toLocaleDateString()}
                        </span>
                        <span className="font-medium text-foreground">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>

                    {/* Mobile Badge */}
                    <div className="mt-2 sm:hidden">
                        <Badge variant={statusVariant} className="capitalize">{product.status}</Badge>
                    </div>
                </div>

                {/* Arrow */}
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronRight />
                </div>
            </CardContent>
        </Card>
    );
};
