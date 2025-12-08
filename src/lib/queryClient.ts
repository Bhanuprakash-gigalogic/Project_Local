import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApiError } from './axios';

const errorHandler = (error: unknown) => {
    // Global error handler for queries and mutations
    const apiError = error as ApiError;
    console.error('Global Query Error:', apiError.message);
    // Suggestion: specific handling like toast.error(apiError.message) could be plugged in here
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
        },
        mutations: {
            retry: 0,
        }
    },
    queryCache: new QueryCache({
        onError: errorHandler,
    }),
    mutationCache: new MutationCache({
        onError: errorHandler,
    }),
});
