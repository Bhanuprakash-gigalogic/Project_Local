import { useState } from 'react';
import { useAuthStore } from '../../auth/stores/auth.store';
import { authService } from '../../auth/services/auth.service';
import { useNavigate } from 'react-router-dom';

export const useAuthAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setAuth, logout: storeLogout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const login = async (email: string, pass: string, remember: boolean = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(email, pass);
            setAuth(response.token, response.user);

            if (remember) {
                localStorage.setItem('admin_remember_email', email);
            } else {
                localStorage.removeItem('admin_remember_email');
            }

            return true;
        } catch (err: any) {
            setError(err.message || 'Login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout(); // Clear service state if any
        storeLogout();
        navigate('/admin/login');
    };

    const forgotPassword = async (email: string) => {
        // Placeholder for API call
        return new Promise<void>((resolve) => setTimeout(resolve, 1000));
    };

    const getStoredEmail = () => {
        return localStorage.getItem('admin_remember_email') || '';
    };

    return {
        login,
        logout,
        forgotPassword,
        isAuthenticated,
        getStoredEmail,
        isLoading,
        error
    };
};
