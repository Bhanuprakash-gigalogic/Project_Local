import React from 'react';
import {
    Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose
} from '@/components/ui/Drawer';
import { User, UserStatus } from '../types/user';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Mail, Phone, MapPin, Calendar, Shield, AlertTriangle } from 'lucide-react';
import { useUpdateUserStatus } from '../hooks/useUsers';
import { useToast } from '@/hooks/useToast';

interface UserDrawerProps {
    user: User | null;
    open: boolean;
    onClose: () => void;
}

export const UserDrawer = ({ user, open, onClose }: UserDrawerProps) => {
    const { mutate: updateStatus, isPending } = useUpdateUserStatus();
    const { addToast } = useToast();

    if (!user) return null;

    const handleStatusChange = (newStatus: UserStatus) => {
        updateStatus({ id: user.id, status: newStatus }, {
            onSuccess: () => {
                addToast({
                    title: "Status Updated",
                    description: `User has been ${newStatus}.`,
                    type: "success"
                });
                onClose();
            }
        });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const variant = status === 'active' ? 'success' : status === 'suspended' ? 'destructive' : 'warning';
        return <Badge variant={variant as any} className="uppercase">{status}</Badge>;
    };

    return (
        <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-2xl">
                    <DrawerHeader className="text-left">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full border-2 border-background shadow-sm" />
                                <div>
                                    <DrawerTitle className="text-2xl">{user.name}</DrawerTitle>
                                    <DrawerDescription className="flex items-center gap-2 mt-1">
                                        <StatusBadge status={user.status} />
                                        <span>•</span>
                                        <span className="capitalize">{user.role}</span>
                                    </DrawerDescription>
                                </div>
                            </div>
                        </div>
                    </DrawerHeader>

                    <div className="p-6 space-y-6">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/20">
                                <Mail className="text-muted-foreground w-5 h-5" />
                                <div className="overflow-hidden">
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/20">
                                <Phone className="text-muted-foreground w-5 h-5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="text-sm font-medium">{user.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/20">
                                <Calendar className="text-muted-foreground w-5 h-5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Last Login</p>
                                    <p className="text-sm font-medium">{new Date(user.lastLogin!).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/20">
                                <MapPin className="text-muted-foreground w-5 h-5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="text-sm font-medium">{user.address?.city}, {user.address?.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs for extra details (Orders, Logs etc) */}
                        <Tabs defaultValue="details">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                                <TabsTrigger value="activity">Activity Log</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="mt-4 space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Full Address</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {user.address?.street}<br />
                                        {user.address?.city}, {user.address?.state} {user.address?.zip}<br />
                                        {user.address?.country}
                                    </p>
                                </div>
                            </TabsContent>
                            <TabsContent value="orders">
                                <div className="p-4 border border-dashed rounded-md text-center text-sm text-muted-foreground">
                                    No recent orders found.
                                </div>
                            </TabsContent>
                            <TabsContent value="activity">
                                <div className="p-4 border border-dashed rounded-md text-center text-sm text-muted-foreground">
                                    No recent activity.
                                </div>
                            </TabsContent>
                        </Tabs>

                    </div>

                    <DrawerFooter className="flex-row justify-end space-x-2 border-t pt-4">
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>

                        {user.status !== 'active' && (
                            <Button
                                variant="default"
                                onClick={() => handleStatusChange('active')}
                                isLoading={isPending}
                            >
                                Activate User
                            </Button>
                        )}

                        {user.status !== 'suspended' && (
                            <Button
                                variant="destructive"
                                onClick={() => handleStatusChange('suspended')}
                                isLoading={isPending}
                            >
                                Suspend User
                            </Button>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
