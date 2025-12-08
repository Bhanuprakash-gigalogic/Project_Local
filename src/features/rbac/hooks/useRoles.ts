import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Role, RolePermissions, ModulePermissions } from '../types/role';

// Mock Data
const MOCK_ROLES: Role[] = [
    { id: 'super-admin', name: 'Super Admin', description: 'Full system access with all permissions', icon: 'shield' },
    { id: 'store-manager', name: 'Store Manager', description: 'Manage products, orders, and inventory', icon: 'store' },
    { id: 'content-editor', name: 'Content Editor', description: 'Manage CMS content and campaigns', icon: 'pencil' },
    { id: 'support-agent', name: 'Support Agent', description: 'Handle customer support and refunds', icon: 'headphones' },
];

const MODULES = ['Users', 'Sellers', 'Products', 'Orders', 'Refunds', 'CMS', 'Campaigns', 'Analytics', 'Settings'];

const generateDefaultPermissions = (roleId: string): RolePermissions => {
    const isSuperAdmin = roleId === 'super-admin';
    const isStoreManager = roleId === 'store-manager';
    const isContentEditor = roleId === 'content-editor';
    const isSupportAgent = roleId === 'support-agent';

    return {
        roleId,
        modules: MODULES.map(module => {
            if (isSuperAdmin) {
                return {
                    module,
                    permissions: { read: true, write: true, update: true, delete: true, manage: true }
                };
            }

            if (isStoreManager) {
                if (['Products', 'Orders', 'Sellers'].includes(module)) {
                    return {
                        module,
                        permissions: { read: true, write: true, update: true, delete: true, manage: true }
                    };
                }
                if (['Analytics', 'Refunds'].includes(module)) {
                    return {
                        module,
                        permissions: { read: true, write: false, update: false, delete: false, manage: false }
                    };
                }
            }

            if (isContentEditor) {
                if (['CMS', 'Campaigns'].includes(module)) {
                    return {
                        module,
                        permissions: { read: true, write: true, update: true, delete: true, manage: false }
                    };
                }
                if (['Analytics'].includes(module)) {
                    return {
                        module,
                        permissions: { read: true, write: false, update: false, delete: false, manage: false }
                    };
                }
            }

            if (isSupportAgent) {
                if (['Orders', 'Refunds', 'Users'].includes(module)) {
                    return {
                        module,
                        permissions: { read: true, write: false, update: true, delete: false, manage: false }
                    };
                }
            }

            return {
                module,
                permissions: { read: false, write: false, update: false, delete: false, manage: false },
                disabled: module === 'Settings' && !isSuperAdmin // Only super admin can manage settings
            };
        })
    };
};

let MOCK_PERMISSIONS: Record<string, RolePermissions> = {};
MOCK_ROLES.forEach(role => {
    MOCK_PERMISSIONS[role.id] = generateDefaultPermissions(role.id);
});

export const useGetRoles = (search?: string) => {
    return useQuery({
        queryKey: ['roles', search],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (search) {
                const q = search.toLowerCase();
                return MOCK_ROLES.filter(r =>
                    r.name.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q)
                );
            }
            return MOCK_ROLES;
        }
    });
};

export const useGetRolePermissions = (roleId: string) => {
    return useQuery({
        queryKey: ['role-permissions', roleId],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return MOCK_PERMISSIONS[roleId] || generateDefaultPermissions(roleId);
        },
        enabled: !!roleId
    });
};

export const useUpdateRolePermissions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ roleId, permissions }: { roleId: string; permissions: RolePermissions }) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            MOCK_PERMISSIONS[roleId] = permissions;
            return permissions;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['role-permissions', variables.roleId] });
        }
    });
};
