import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminSetupService } from '../services/admin-setup.service';
import {
    AdminLoginDTO,
    AdminAuthResponse,
    SetupProgress,
    UpdateSetupProgressDTO,
    SetupValidationResponse
} from '../types/setup';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand store for admin auth state
interface AdminAuthStore {
    token: string | null;
    user: AdminAuthResponse['user'] | null;
    setAuth: (auth: AdminAuthResponse) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            setAuth: (auth) => {
                set({ token: auth.token, user: auth.user });
                // Store token in localStorage for axios interceptors
                localStorage.setItem('admin_token', auth.token);
            },
            clearAuth: () => {
                set({ token: null, user: null });
                localStorage.removeItem('admin_token');
            },
            isAuthenticated: () => {
                return get().token !== null;
            }
        }),
        {
            name: 'admin-auth-storage',
        }
    )
);

// Login mutation
export function useAdminLogin() {
    const { setAuth } = useAdminAuthStore();

    return useMutation({
        mutationFn: (data: AdminLoginDTO) => adminSetupService.login(data),
        onSuccess: (data) => {
            setAuth(data);
        },
    });
}

// Logout helper
export function useAdminLogout() {
    const { clearAuth } = useAdminAuthStore();
    const queryClient = useQueryClient();

    return () => {
        clearAuth();
        queryClient.clear();
    };
}

// Get setup progress
export function useGetSetupProgress() {
    return useQuery({
        queryKey: ['admin-setup-progress'],
        queryFn: () => adminSetupService.getSetupProgress(),
    });
}

// Update setup progress
export function useUpdateSetupProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSetupProgressDTO) => adminSetupService.updateSetupProgress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-setup-progress'] });
        },
    });
}

// Validate setup completion
export function useValidateSetupCompletion() {
    return useQuery({
        queryKey: ['admin-setup-validation'],
        queryFn: () => adminSetupService.validateSetupCompletion(),
        enabled: false, // Only run when explicitly called
    });
}

// Custom hook for admin auth
export function useAdminAuth() {
    const { token, user, isAuthenticated, clearAuth } = useAdminAuthStore();
    const logout = useAdminLogout();

    return {
        token,
        user,
        isAuthenticated: isAuthenticated(),
        logout,
    };
}
