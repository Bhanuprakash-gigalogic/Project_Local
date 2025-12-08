import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Define the shape of the error response from the API
export interface ApiError {
    message: string;
    code?: string;
    errors?: Record<string, string[]>;
}

// Create Axios Instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Error Normalization
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError<ApiError>) => {
        const errorResponse: ApiError = {
            message: error.message || 'An unexpected error occurred',
        };

        if (error.response) {
            // Server responded with a status code outside of 2xx
            errorResponse.message = error.response.data.message || errorResponse.message;
            errorResponse.code = error.response.data.code;
            errorResponse.errors = error.response.data.errors;

            // Handle unauthorized (401) - e.g., redirect to login or clear token
            if (error.response.status === 401) {
                // Implement logout logic or event emission here
                console.warn('Unauthorized access - potential redirect needed');
            }

        } else if (error.request) {
            // The request was made but no response was received
            errorResponse.message = 'No response received from server';
        }

        return Promise.reject(errorResponse);
    }
);

export default axiosInstance;
