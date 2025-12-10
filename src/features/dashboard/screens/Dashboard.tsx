import React, { useState } from 'react';
import {
    useDashboardSummary,
    useSalesTrend,
    useTopSellingProducts,
    useLowInventory
} from '../hooks/useDashboard';
import { DashboardMetricCard } from '../components/MetricCard';
import { DollarSign, ShoppingCart, Users, Store, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/format';

const Dashboard = () => {
    const [range, setRange] = useState('30d');

    // Queries
    const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
    const { data: salesData, isLoading: isSalesLoading } = useSalesTrend(range);
    const { data: topProducts, isLoading: isProductsLoading } = useTopSellingProducts(range);
    const { data: lowInventory, isLoading: isInventoryLoading } = useLowInventory();



    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your store's performance.</p>
                </div>

                {/* Filters */}
                <div className="flex item-center gap-2">
                    <Tabs value={range} onValueChange={setRange}>
                        <TabsList>
                            <TabsTrigger value="7d">7 Days</TabsTrigger>
                            <TabsTrigger value="30d">30 Days</TabsTrigger>
                            <TabsTrigger value="90d">90 Days</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {/* Placeholder for custom date picker if needed */}
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardMetricCard
                    title="Total GMV"
                    value={summary ? formatCurrency(summary.gmv.value) : '₹0.00'}
                    trend={summary?.gmv.trend || 0}
                    icon={DollarSign}
                    loading={isSummaryLoading}
                />
                <DashboardMetricCard
                    title="Total Orders"
                    value={summary?.totalOrders.value || 0}
                    trend={summary?.totalOrders.trend || 0}
                    icon={ShoppingCart}
                    loading={isSummaryLoading}
                />
                <DashboardMetricCard
                    title="Active Users"
                    value={summary?.activeUsers.value || 0}
                    trend={summary?.activeUsers.trend || 0}
                    icon={Users}
                    loading={isSummaryLoading}
                />
                <DashboardMetricCard
                    title="Active Sellers"
                    value={summary?.activeSellers.value || 0}
                    trend={summary?.activeSellers.trend || 0}
                    icon={Store}
                    loading={isSummaryLoading}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Sales Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Sales Trend</CardTitle>
                        <CardDescription>Revenue over the last {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '3 months'}</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {isSalesLoading ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <Skeleton className="h-[250px] w-full" />
                            </div>
                        ) : salesData && salesData.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                                        <XAxis
                                            dataKey="label"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `₹${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyState title="No Sales Data" description="No sales recorded for this period." />
                        )}
                    </CardContent>
                </Card>

                {/* Low Inventory Alert */}
                <Card className="col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Low Inventory</CardTitle>
                            {isInventoryLoading && <Skeleton className="h-4 w-4 rounded-full" />}
                        </div>
                        <CardDescription>Products below stock threshold</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isInventoryLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : lowInventory && lowInventory.length > 0 ? (
                            <div className="space-y-4">
                                {lowInventory.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                                                <AlertTriangle size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">Stock: <span className="font-semibold text-red-600">{item.stock}</span> (alert at {item.threshold})</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-7 text-xs">Restock</Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground text-center">
                                <p className="text-sm">No inventory alerts.</p>
                                <p className="text-xs">All products are well stocked.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {isProductsLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : topProducts && topProducts.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead className="text-right">Units Sold</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover bg-secondary" />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-right">{product.unitsSold.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-semibold">{formatCurrency(product.revenue)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <EmptyState title="No Products Found" description="No sales data available for top products." />
                    )}
                </CardContent>
            </Card>

        </div>
    );
};

export default Dashboard;
