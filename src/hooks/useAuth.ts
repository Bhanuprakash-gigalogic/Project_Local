import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            login: (token, user) => {
                localStorage.setItem('access_token', token);
                set({ token, user });
            },
            logout: () => {
                localStorage.removeItem('access_token');
                set({ token: null, user: null });
            },
            isAuthenticated: () => !!get().token,
        }),
        {
            name: 'auth-storage',
        }
    )
);
