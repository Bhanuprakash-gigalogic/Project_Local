import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserFilter, PaginatedUsers, UserStatus } from '../types/user';

// Mock Data
const MOCK_USERS: User[] = Array.from({ length: 50 }).map((_, i) => ({
    id: (i + 1).toString(),
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `+1 555-01${(i + 1).toString().padStart(2, '0')}`,
    role: i % 3 === 0 ? 'seller' : 'buyer',
    status: i % 10 === 0 ? 'suspended' : i % 5 === 0 ? 'pending' : 'active',
    avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    address: {
        street: `${i + 1} Main St`,
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
    }
}));

// Simulate API call
const fetchUsers = async (filter: UserFilter): Promise<PaginatedUsers> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Latency

    let filtered = MOCK_USERS.filter(u => u.role === filter.role);

    if (filter.status && filter.status !== 'all') {
        filtered = filtered.filter(u => u.status === filter.status);
    }

    if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filtered = filtered.filter(u =>
            u.name.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower)
        );
    }

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        data: filtered.slice(start, end),
        meta: {
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit)
        }
    };
};

export const useGetUsers = (filter: UserFilter) => {
    return useQuery({
        queryKey: ['users', filter],
        queryFn: () => fetchUsers(filter),
        placeholderData: (previousData) => previousData,
    });
};

export const useGetUserById = (id: string | null) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_USERS.find(u => u.id === id) || null;
        },
        enabled: !!id
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
            await new Promise(resolve => setTimeout(resolve, 600));
            // In a real app we would PATCH to API
            // For mock, we can't easily update the const array strictly, 
            // but we can simulate success.
            return { id, status };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });
};
