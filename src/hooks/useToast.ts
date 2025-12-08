import { create } from 'zustand';

// Simple toast store implementation
// In a real app, you might use 'sonner' or 'react-hot-toast'

interface Toast {
    id: string;
    title?: string;
    description: string;
    type?: 'default' | 'success' | 'destructive';
    duration?: number;
}

interface ToastState {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    dismissToast: (id: string) => void;
}

export const useToast = create<ToastState>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));

        if (toast.duration !== Infinity) {
            setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id)
                }));
            }, toast.duration || 3000);
        }
    },
    dismissToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}));
