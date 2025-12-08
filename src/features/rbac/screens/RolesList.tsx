import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetRoles } from '../hooks/useRoles';
import { RoleCard } from '../components/RoleCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

const RolesList = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const { data: roles, isLoading } = useGetRoles(search);

    const handleSelectRole = (roleId: string) => {
        navigate(`/admin/settings/rbac/${roleId}`);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                <p className="text-muted-foreground mt-2">Manage access control for different admin roles.</p>
            </div>

            <SearchInput
                placeholder="Search roles..."
                onSearch={setSearch}
                className="w-full md:w-[400px]"
            />

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))
                ) : roles?.length === 0 ? (
                    <EmptyState
                        title="No Roles Found"
                        description="Try adjusting your search."
                    />
                ) : (
                    roles?.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onClick={handleSelectRole}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default RolesList;
