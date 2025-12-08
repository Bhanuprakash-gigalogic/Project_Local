import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/Table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { User, UserRole, UserStatus } from '../types/user';
import { useGetUsers } from '../hooks/useUsers';
import { UserRow } from '../components/UserRow';
import { UserDrawer } from '../components/UserDrawer';
import { Button } from '@/components/ui/Button';
import { Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const UsersList = () => {
    // URL State for tabs could be added, using local state for simplicity as per requirements
    const [role, setRole] = useState<UserRole>('buyer');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all'); // Simple filter toggle

    // For Drawer
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data, isLoading } = useGetUsers({ role, search, page, status: statusFilter });

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setDrawerOpen(true);
    };

    const handleTabChange = (val: string) => {
        setRole(val as UserRole);
        setPage(1); // Reset page on tab switch
    };

    const toggleStatusFilter = () => {
        const next = statusFilter === 'all' ? 'active' : statusFilter === 'active' ? 'suspended' : statusFilter === 'suspended' ? 'pending' : 'all';
        setStatusFilter(next);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>

            <Card>
                <CardHeader className="p-4 border-b">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <Tabs value={role} onValueChange={handleTabChange} className="w-full md:w-auto">
                            <TabsList>
                                <TabsTrigger value="buyer">Buyers</TabsTrigger>
                                <TabsTrigger value="seller">Sellers</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <SearchInput
                                placeholder="Search by name or email..."
                                onSearch={(val) => { setSearch(val); setPage(1); }}
                                className="w-full md:w-[300px]"
                            />
                            <Button variant="outline" size="icon" onClick={toggleStatusFilter} title={`Filter: ${statusFilter}`}>
                                <Filter className={`h-4 w-4 ${statusFilter !== 'all' ? 'text-primary' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Avatar</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : data?.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-60">
                                        <EmptyState
                                            title="No users found"
                                            description={search ? `No results for "${search}"` : "No users in this category."}
                                            className="border-none"
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.data.map((user) => (
                                    <UserRow key={user.id} user={user} onView={handleViewUser} />
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {data?.meta && data.meta.totalPages > 1 && (
                        <div className="p-4 border-t flex justify-end">
                            <Pagination
                                currentPage={page}
                                totalPages={data.meta.totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <UserDrawer
                open={drawerOpen}
                user={selectedUser}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
};

export default UsersList;
