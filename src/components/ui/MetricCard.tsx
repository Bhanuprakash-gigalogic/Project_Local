import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '../../lib/utils';
import { ArrowDownRight, ArrowUpRight, DollarSign, LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: LucideIcon;
    className?: string;
}

export function MetricCard({
    title,
    value,
    description,
    trend,
    icon: Icon,
    className,
}: MetricCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {trend && (
                            <span className={cn("flex items-center", trend.isPositive ? "text-green-500" : "text-red-500")}>
                                {trend.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                {Math.abs(trend.value)}%
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
