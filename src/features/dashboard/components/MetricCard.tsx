import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface DashboardMetricCardProps {
    title: string;
    value: string | number;
    trend: number;
    icon?: LucideIcon;
    loading?: boolean;
}

export const DashboardMetricCard = ({ title, value, trend, icon: Icon, loading }: DashboardMetricCardProps) => {
    if (loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-[120px] mb-2" />
                    <Skeleton className="h-3 w-[80px]" />
                </CardContent>
            </Card>
        );
    }

    const isPositive = trend >= 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <span className={cn("flex items-center mr-1", isPositive ? "text-green-500" : "text-red-500")}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                        {Math.abs(trend)}%
                    </span>
                    from last period
                </p>
            </CardContent>
        </Card>
    );
};
