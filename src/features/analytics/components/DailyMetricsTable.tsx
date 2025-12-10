import React from 'react';
import { DailyMetric } from '../types/analytics';
import { formatCurrency } from '@/utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';
import { useExportSalesReport } from '../hooks/useAnalytics';
import { useToast } from '@/hooks/useToast';

interface DailyMetricsTableProps {
    data?: DailyMetric[];
    isLoading: boolean;
    onExport: () => void;
    isExporting: boolean;
}

export const DailyMetricsTable = ({ data, isLoading, onExport, isExporting }: DailyMetricsTableProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Daily Breakdown</CardTitle>
                <Button variant="outline" size="sm" onClick={onExport} isLoading={isExporting}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Orders</TableHead>
                            <TableHead className="text-right">Gross Sales</TableHead>
                            <TableHead className="text-right">Returns</TableHead>
                            <TableHead className="text-right">Net Sales</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No data available for this range.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((row) => (
                                <TableRow key={row.date}>
                                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">{row.orders}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.grossSales)}</TableCell>
                                    <TableCell className="text-right text-destructive">-{formatCurrency(row.returns)}</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(row.netSales)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
