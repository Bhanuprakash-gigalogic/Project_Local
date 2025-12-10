import axios from 'axios';
import { IAuthService, LoginResponse } from '../../../lib/api.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// Default to true for now since user wants mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

class MockAuthService implements IAuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        console.log('Using Mock Auth Service');

        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (email === 'admin@example.com' && password === 'admin123') {
            return {
                token: 'mock-jwt-token-' + Math.random().toString(36).substring(7),
                user: {
                    id: 'mock-user-1',
                    email: 'admin@example.com',
                    name: 'Mock Super Admin',
                    role: 'super_admin',
                },
            };
        }

        throw new Error('Invalid credentials (Try: admin@example.com / admin123)');
    }

    logout(): void {
        // Mock logout - nothing to do server side
        console.log('Mock logout');
    }
}

class RealAuthService implements IAuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
        return response.data;
    }

    logout(): void {
        // Implement real logout logic if API exists, e.g., invalidate token
        // await axios.post(`${API_BASE_URL}/admin/logout`);
    }
}

export const authService: IAuthService = USE_MOCK ? new MockAuthService() : new RealAuthService();
