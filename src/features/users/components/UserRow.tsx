import React from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Eye, Ban, CheckCircle } from 'lucide-react';
import { User } from '../types/user';
import { useUpdateUserStatus } from '../hooks/useUsers';
import { useToast } from '@/hooks/useToast';

interface UserRowProps {
    user: User;
    onView: (user: User) => void;
}

export const UserRow = ({ user, onView }: UserRowProps) => {
    const { mutate: updateStatus } = useUpdateUserStatus();
    const { addToast } = useToast();

    // Handled via simple confirm for row actions for speed
    const handleAction = (status: 'active' | 'suspended') => {
        updateStatus({ id: user.id, status }, {
            onSuccess: () => {
                addToast({
                    title: `User ${status}`,
                    description: `User marked as ${status}`,
                    type: status === 'active' ? 'success' : 'destructive'
                });
            }
        });
    };

    const statusVariant =
        user.status === 'active' ? 'success' :
            user.status === 'suspended' ? 'destructive' : 'warning';

    return (
        <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => onView(user)}>
            <TableCell>
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
                <Badge variant={statusVariant}>{user.status}</Badge>
            </TableCell>
            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(user)} title="View Details">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    {/* Quick Actions */}
                    {user.status === 'active' ? (
                        <Button variant="ghost" size="icon" onClick={() => handleAction('suspended')} title="Suspend">
                            <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleAction('active')} title="Activate">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
};
