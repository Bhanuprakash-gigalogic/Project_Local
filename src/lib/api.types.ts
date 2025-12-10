export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface IAuthService {
    login(email: string, password: string): Promise<LoginResponse>;
    logout(): void;
}
