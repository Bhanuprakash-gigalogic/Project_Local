import React, { useState, useEffect } from 'react';
import { useGetOrders, useGetOrderById } from '../hooks/useOrders';
import { OrderStatus } from '../types/order';
import { OrderRow } from '../components/OrderRow';
import { OrderDetail } from '../components/OrderDetail';
import { SearchInput } from '@/components/ui/SearchInput';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Loader2 } from 'lucide-react';

const OrdersList = () => {
    // View State
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // List Logic
    const [status, setStatus] = useState<OrderStatus | 'all'>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // Queries
    const { data: listData, isLoading: isListLoading, error } = useGetOrders({ status, search, page });
    const { data: detailData, isLoading: isDetailLoading } = useGetOrderById(selectedId);

    const handleSelectOrder = (id: string) => {
        console.log("Selecting order:", id);
        setSelectedId(id);
        setView('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setSelectedId(null);
        setView('list');
    };

    const handleTabChange = (val: string) => {
        setStatus(val as OrderStatus | 'all');
        setPage(1);
    };

    if (error) {
        return <div className="p-8 text-destructive text-center">Error loading orders. Please refresh.</div>;
    }

    // Render Detail
    if (view === 'detail') {
        if (isDetailLoading) return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
        if (!detailData) return (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <p>Order not found.</p>
                <button onClick={handleBack} className="text-primary hover:underline">Back to list</button>
            </div>
        );
        return <OrderDetail order={detailData} onBack={handleBack} />;
    }

    // Render List
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">Manage and fulfill store orders.</p>
            </div>

            <Card>
                <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4">
                    <Tabs value={status} onValueChange={handleTabChange} className="w-full md:w-auto overflow-x-auto">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="processing">Proces.</TabsTrigger>
                            <TabsTrigger value="shipped">Shipped</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <SearchInput
                        placeholder="Search order ID or customer..."
                        onSearch={(val) => { setSearch(val); setPage(1); }}
                        className="w-full md:w-[300px]"
                    />
                </div>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isListLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))
                            ) : listData?.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <EmptyState
                                            title="No Orders Found"
                                            description="There are no orders matching your criteria."
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                listData?.data.map((order) => (
                                    <OrderRow key={order.id} order={order} onClick={handleSelectOrder} />
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {listData && listData.meta.totalPages > 1 && (
                        <div className="p-4 border-t flex justify-end">
                            <Pagination
                                currentPage={listData.meta.page}
                                totalPages={listData.meta.totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OrdersList;
