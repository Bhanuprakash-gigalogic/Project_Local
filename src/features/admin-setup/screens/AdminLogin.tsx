import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../auth/stores/auth.store';
import { adminSetupService } from '../services/admin-setup.service';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
    email_or_phone: z.string().min(3, 'Email or phone is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    remember_me: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { setAuth } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email_or_phone: '',
            password: '',
            remember_me: false,
        },
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setServerError(null);
            setIsLoading(true);
            const response = await adminSetupService.login(data);
            setAuth(response.token, response.user as any);
            navigate('/admin');
        } catch (error: any) {
            setServerError(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <span className="text-2xl font-bold text-white">A</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
                    <p className="text-gray-600 mt-2">Sign in to manage your platform</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Server Error */}
                        {serverError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-red-800">Login Failed</p>
                                    <p className="text-sm text-red-600 mt-1">{serverError}</p>
                                </div>
                            </div>
                        )}

                        {/* Email/Phone Field */}
                        <div>
                            <label htmlFor="email_or_phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Email or Phone
                            </label>
                            <input
                                id="email_or_phone"
                                type="text"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.email_or_phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="admin@example.com"
                                {...register('email_or_phone')}
                            />
                            {errors.email_or_phone && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.email_or_phone.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="••••••••"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                {...register('remember_me')}
                            />
                            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-medium text-blue-900 mb-2">Demo Credentials:</p>
                            <p className="text-xs text-blue-700">Email: admin@example.com</p>
                            <p className="text-xs text-blue-700">Password: admin123</p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    © 2025 Admin Dashboard. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
