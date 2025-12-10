import React, { useState } from 'react';
import { useGetPayoutHistory, useRetryPayout } from '../hooks/usePayouts';
import { PayoutStatus } from '../types/payout';
import { formatCurrency } from '@/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { RefreshCw, Download } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';

export const PayoutHistory = () => {
    const [status, setStatus] = useState<PayoutStatus | 'all'>('all'); // could add filter dropdown later
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [retryId, setRetryId] = useState<string | null>(null);

    const { data, isLoading } = useGetPayoutHistory({ status, search, page });
    const { mutate: retry, isPending: isRetrying } = useRetryPayout();
    const { addToast } = useToast();

    const handleRetry = () => {
        if (!retryId) return;
        retry(retryId, {
            onSuccess: () => {
                addToast({ title: "Retry Initiated", description: "Payout is being processed again.", type: "success" });
                setRetryId(null);
            }
        });
    };

    const statusBadge = (s: PayoutStatus) => {
        const variant = s === 'completed' ? 'success' : s === 'failed' ? 'destructive' : s === 'processing' ? 'default' : 'warning';
        return <Badge variant={variant} className="capitalize">{s}</Badge>;
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <SearchInput
                    placeholder="Search vendor or payout ID..."
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    className="w-full md:w-[300px]"
                />
                <Button variant="outline" onClick={() => addToast({ title: "Export Started", description: "CSV download will begin shortly." })}>
                    <Download size={16} className="mr-2" /> Export CSV
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payout ID</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Order Ref</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))
                            ) : data?.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center">
                                        <EmptyState title="No Payouts Found" description="Try adjusting your search." />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.data.map((payout) => (
                                    <TableRow key={payout.id}>
                                        <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{payout.vendorName}</div>
                                                <div className="text-xs text-muted-foreground">{payout.vendorEmail}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {payout.orderId || '-'}
                                        </TableCell>
                                        <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{statusBadge(payout.status)}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(payout.amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {payout.status === 'failed' && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setRetryId(payout.id)}
                                                >
                                                    <RefreshCw size={14} className="mr-1" /> Retry
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {data && data.meta.totalPages > 1 && (
                        <div className="p-4 border-t flex justify-end">
                            <Pagination
                                currentPage={data.meta.page}
                                totalPages={data.meta.totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Modal open={!!retryId} onOpenChange={(o) => !o && setRetryId(null)}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Retry Payout?</ModalTitle>
                        <ModalDescription>
                            This will attempt to process the payout again. Ensure banking details are correct.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setRetryId(null)}>Cancel</Button>
                        <Button onClick={handleRetry} isLoading={isRetrying}>Confirm Retry</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
