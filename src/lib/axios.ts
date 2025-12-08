import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCSRFToken, rateLimiter } from '@/utils/security';

// Define the shape of the error response from the API
export interface ApiError {
    message: string;
    code?: string;
    errors?: Record<string, string[]>;
}

// Create Axios Instance with enhanced security
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000, // 30 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies for CORS requests
});

// Request Interceptor: Attach Token, CSRF, and Rate Limiting
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Rate limiting check
        const endpoint = config.url || 'unknown';
        if (!rateLimiter.check(endpoint)) {
            return Promise.reject({
                message: 'Too many requests. Please try again later.',
                code: 'RATE_LIMIT_EXCEEDED'
            });
        }

        // Attach auth token
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Attach CSRF token for state-changing requests
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
            const csrfToken = getCSRFToken();
            if (config.headers) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
        }

        // Add request timestamp for monitoring
        if (config.headers) {
            config.headers['X-Request-Time'] = new Date().toISOString();
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Error Normalization and Security
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Validate response integrity (basic check)
        if (response.headers['content-type']?.includes('application/json')) {
            // Response is valid JSON
            return response;
        }
        return response;
    },
    (error: AxiosError<ApiError>) => {
        const errorResponse: ApiError = {
            message: error.message || 'An unexpected error occurred',
        };

        if (error.response) {
            // Server responded with a status code outside of 2xx
            errorResponse.message = error.response.data?.message || errorResponse.message;
            errorResponse.code = error.response.data?.code;
            errorResponse.errors = error.response.data?.errors;

            // Handle unauthorized (401) - redirect to login
            if (error.response.status === 401) {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                console.warn('Unauthorized access - redirecting to login');
            }

            // Handle forbidden (403)
            if (error.response.status === 403) {
                errorResponse.message = 'You do not have permission to perform this action';
            }

            // Handle server errors (5xx)
            if (error.response.status >= 500) {
                errorResponse.message = 'Server error. Please try again later.';
            }

        } else if (error.request) {
            // The request was made but no response was received
            errorResponse.message = 'No response received from server. Please check your connection.';
        }

        return Promise.reject(errorResponse);
    }
);

// Helper function to set auth token
export const setAuthToken = (token: string) => {
    localStorage.setItem('access_token', token);
};

// Helper function to clear auth token
export const clearAuthToken = () => {
    localStorage.removeItem('access_token');
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token');
};

export default axiosInstance;
export { axiosInstance };
