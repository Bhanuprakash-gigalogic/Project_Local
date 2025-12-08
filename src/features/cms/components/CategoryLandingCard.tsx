import React from 'react';
import { CategoryLanding } from '../types/cms';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, LayoutTemplate, AlertCircle } from 'lucide-react';

interface CategoryLandingCardProps {
    category: CategoryLanding;
    onClick: (id: string) => void;
}

export const CategoryLandingCard = ({ category, onClick }: CategoryLandingCardProps) => {
    return (
        <Card
            className="cursor-pointer hover:border-primary/50 transition-all group"
            onClick={() => onClick(category.id)}
        >
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${category.isConfigured ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <LayoutTemplate size={20} />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{category.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        {category.isConfigured ? (
                            <Badge variant="outline" className="text-xs font-normal">Configured</Badge>
                        ) : (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <AlertCircle size={12} /> No landing content
                            </span>
                        )}
                    </div>
                </div>

                <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
            </CardContent>
        </Card>
    );
};
