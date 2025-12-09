import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRolePermissions, useUpdateRolePermissions, useGetRoles } from '../hooks/useRoles';
import { RolePermissions as RolePermissionsType, ModulePermissions } from '../types/role';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, Save, Shield, Store, Pencil, Headphones } from 'lucide-react';

const RolePermissions = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const { data: roles } = useGetRoles();
    const { data: permissions, isLoading } = useGetRolePermissions(roleId || '');
    const { mutate: updatePermissions, isPending } = useUpdateRolePermissions();

    const [localPermissions, setLocalPermissions] = useState<RolePermissionsType | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (permissions) {
            setLocalPermissions(permissions);
            setIsDirty(false);
        }
    }, [permissions]);

    const role = roles?.find(r => r.id === roleId);

    const getRoleIcon = () => {
        if (!role) return null;
        switch (role.icon) {
            case 'shield': return <Shield size={24} className="text-primary" />;
            case 'store': return <Store size={24} className="text-blue-500" />;
            case 'pencil': return <Pencil size={24} className="text-purple-500" />;
            case 'headphones': return <Headphones size={24} className="text-green-500" />;
        }
    };

    const handleToggle = (moduleIndex: number, permissionKey: keyof ModulePermissions['permissions']) => {
        if (!localPermissions) return;

        const newPermissions = { ...localPermissions };
        newPermissions.modules[moduleIndex].permissions[permissionKey] =
            !newPermissions.modules[moduleIndex].permissions[permissionKey];

        setLocalPermissions(newPermissions);
        setIsDirty(true);
    };

    const handleSave = () => {
        if (!localPermissions || !roleId) return;

        updatePermissions({ roleId, permissions: localPermissions }, {
            onSuccess: () => {
                addToast({ title: "Permissions Updated", description: "", type: "success" });
                setIsDirty(false);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!localPermissions || !role) {
        return <div className="p-8 text-center text-muted-foreground">Role not found</div>;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin/settings/rbac')}
                >
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex items-center gap-3">
                    {getRoleIcon()}
                    <div>
                        <h1 className="text-2xl font-bold">{role.name}</h1>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                </div>
            </div>

            {/* Permissions Grid */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <CardTitle>Module Permissions</CardTitle>
                    <Button
                        onClick={handleSave}
                        disabled={!isDirty}
                        isLoading={isPending}
                        className="w-full sm:w-auto"
                    >
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Module</th>
                                    <th className="text-center p-4 font-semibold w-24">Read</th>
                                    <th className="text-center p-4 font-semibold w-24">Write</th>
                                    <th className="text-center p-4 font-semibold w-24">Update</th>
                                    <th className="text-center p-4 font-semibold w-24">Delete</th>
                                    <th className="text-center p-4 font-semibold w-24">Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {localPermissions.modules.map((module, idx) => (
                                    <tr
                                        key={module.module}
                                        className={`border-b hover:bg-muted/30 transition-colors ${module.disabled ? 'opacity-50' : ''
                                            }`}
                                    >
                                        <td className="p-4 font-medium">{module.module}</td>
                                        <td className="p-4 text-center">
                                            <Toggle
                                                checked={module.permissions.read}
                                                onCheckedChange={() => handleToggle(idx, 'read')}
                                                disabled={module.disabled}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <Toggle
                                                checked={module.permissions.write}
                                                onCheckedChange={() => handleToggle(idx, 'write')}
                                                disabled={module.disabled}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <Toggle
                                                checked={module.permissions.update}
                                                onCheckedChange={() => handleToggle(idx, 'update')}
                                                disabled={module.disabled}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <Toggle
                                                checked={module.permissions.delete}
                                                onCheckedChange={() => handleToggle(idx, 'delete')}
                                                disabled={module.disabled}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <Toggle
                                                checked={module.permissions.manage}
                                                onCheckedChange={() => handleToggle(idx, 'manage')}
                                                disabled={module.disabled}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {isDirty && (
                <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-bottom">
                    Unsaved changes
                </div>
            )}
        </div>
    );
};

export default RolePermissions;
