import React from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight } from 'lucide-react';
import { Order } from '../types/order';

interface OrderRowProps {
    order: Order;
    onClick: (id: string) => void;
}

export const OrderRow = ({ order, onClick }: OrderRowProps) => {
    // Determine variant based on status
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'cancelled': return 'destructive';
            case 'shipped': return 'default'; // 'default' variant usually primary color
            case 'processing': return 'secondary'; // using secondary for processing
            default: return 'warning'; // pending or others
        }
    };

    return (
        <TableRow
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onClick(order.id)}
        >
            <TableCell className="font-mono font-medium">{order.id}</TableCell>
            <TableCell className="font-medium">{order.customerName}</TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
                <Badge variant={getStatusVariant(order.status)} className="capitalize">
                    {order.status}
                </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
                ${order.totalAmount.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </TableCell>
        </TableRow>
    );
};
