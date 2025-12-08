export interface Permission {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    manage: boolean;
}

export interface ModulePermissions {
    module: string;
    permissions: Permission;
    disabled?: boolean; // Backend flag to disable certain permissions
}

export interface RolePermissions {
    roleId: string;
    modules: ModulePermissions[];
}

export interface Role {
    id: string;
    name: string;
    description: string;
    icon: 'shield' | 'store' | 'pencil' | 'headphones';
}
