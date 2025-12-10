import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials: { email: string; password: string }) =>
            authService.login(credentials.email, credentials.password),
        onSuccess: (data) => {
            const { token, user } = data;
            setAuth(token, user);
            navigate('/admin');
        },
        onError: (error) => {
            console.error('Login failed:', error);
        },
    });
};
