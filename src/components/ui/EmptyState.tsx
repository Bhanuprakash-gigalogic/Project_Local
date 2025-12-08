import * as React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    title,
    description,
    icon: Icon = PackageOpen,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed",
                className
            )}
        >
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    {description}
                </p>
                {action && (
                    <Button onClick={action.onClick} variant="default">
                        {action.label}
                    </Button>
                )}
            </div>
        </div>
    );
}
