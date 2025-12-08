import React from 'react';
import { Role } from '../types/role';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield, Store, Pencil, Headphones, ChevronRight } from 'lucide-react';

interface RoleCardProps {
    role: Role;
    onClick: (id: string) => void;
}

export const RoleCard = ({ role, onClick }: RoleCardProps) => {
    const getIcon = () => {
        switch (role.icon) {
            case 'shield': return <Shield size={24} className="text-primary" />;
            case 'store': return <Store size={24} className="text-blue-500" />;
            case 'pencil': return <Pencil size={24} className="text-purple-500" />;
            case 'headphones': return <Headphones size={24} className="text-green-500" />;
        }
    };

    return (
        <Card
            className="cursor-pointer hover:border-primary/50 transition-all group"
            onClick={() => onClick(role.id)}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">{getIcon()}</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{role.name}</h3>
                            <p className="text-sm text-muted-foreground truncate mt-1">{role.description}</p>
                        </div>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" size={20} />
                </div>
            </CardContent>
        </Card>
    );
};
