export type UserRole = 'buyer' | 'seller' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    avatar: string;
    createdAt: string;
    lastLogin?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}

export interface UserFilter {
    role: UserRole;
    status?: UserStatus | 'all';
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedUsers {
    data: User[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
