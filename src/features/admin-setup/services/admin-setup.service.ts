import axios from 'axios';
import {
    AdminLoginDTO,
    AdminAuthResponse,
    SetupProgress,
    UpdateSetupProgressDTO,
    SetupValidationResponse,
    SetupStep,
    SetupStatus
} from '../types/setup';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

export interface IAdminSetupService {
    login(data: AdminLoginDTO): Promise<AdminAuthResponse>;
    getSetupProgress(): Promise<SetupProgress>;
    updateSetupProgress(data: UpdateSetupProgressDTO): Promise<SetupProgress>;
    validateSetupCompletion(): Promise<SetupValidationResponse>;
}

class MockAdminSetupService implements IAdminSetupService {
    private setupProgress: SetupProgress = {
        current_step: SetupStep.ZONES,
        status: SetupStatus.NOT_STARTED,
        completed_steps: [],
        zones_count: 0,
        categories_count: 0,
        banners_count: 0,
        allocated_sellers_count: 0,
        is_setup_complete: false,
        updated_at: new Date().toISOString()
    };

    async login(data: AdminLoginDTO): Promise<AdminAuthResponse> {
        await new Promise(r => setTimeout(r, 800));

        // Mock validation
        if (data.email_or_phone === 'admin@example.com' && data.password === 'admin123') {
            return {
                token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
                user: {
                    id: 'admin_1',
                    email: 'admin@example.com',
                    name: 'Admin User',
                    role: 'super_admin',
                    created_at: new Date().toISOString()
                },
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };
        }

        throw new Error('Invalid credentials');
    }

    async getSetupProgress(): Promise<SetupProgress> {
        await new Promise(r => setTimeout(r, 400));

        // Simulate fetching real counts from other services
        // In real implementation, this would query zones, categories, etc.
        return {
            ...this.setupProgress,
            zones_count: 2, // Mock: would fetch from zones service
            categories_count: 5, // Mock: would fetch from categories service
            banners_count: 3, // Mock: would fetch from banners service
            allocated_sellers_count: 4 // Mock: would fetch from allocations service
        };
    }

    async updateSetupProgress(data: UpdateSetupProgressDTO): Promise<SetupProgress> {
        await new Promise(r => setTimeout(r, 500));

        if (data.mark_complete && !this.setupProgress.completed_steps.includes(data.step)) {
            this.setupProgress.completed_steps.push(data.step);
        }

        this.setupProgress.current_step = data.step;
        this.setupProgress.status = SetupStatus.IN_PROGRESS;
        this.setupProgress.updated_at = new Date().toISOString();

        // Check if all steps are complete
        const allSteps = [
            SetupStep.ZONES,
            SetupStep.CATEGORIES,
            SetupStep.BANNERS,
            SetupStep.SELLER_ALLOCATION
        ];

        if (allSteps.every(step => this.setupProgress.completed_steps.includes(step))) {
            this.setupProgress.is_setup_complete = true;
            this.setupProgress.status = SetupStatus.COMPLETED;
            this.setupProgress.current_step = SetupStep.COMPLETE;
        }

        return this.getSetupProgress();
    }

    async validateSetupCompletion(): Promise<SetupValidationResponse> {
        await new Promise(r => setTimeout(r, 300));

        const progress = await this.getSetupProgress();
        const missing: string[] = [];

        if (progress.zones_count === 0) {
            missing.push('At least 1 zone must be created');
        }
        if (progress.categories_count === 0) {
            missing.push('At least 1 category must be created');
        }
        if (progress.banners_count === 0) {
            missing.push('At least 1 banner must be uploaded');
        }
        if (progress.allocated_sellers_count === 0) {
            missing.push('At least 1 seller must be allocated to a zone');
        }

        return {
            is_valid: missing.length === 0,
            missing_requirements: missing,
            can_proceed: missing.length === 0
        };
    }
}

class RealAdminSetupService implements IAdminSetupService {
    async login(data: AdminLoginDTO): Promise<AdminAuthResponse> {
        const res = await axios.post(`${API_BASE_URL}/admin/login`, data);
        return res.data;
    }

    async getSetupProgress(): Promise<SetupProgress> {
        const res = await axios.get(`${API_BASE_URL}/admin/setup/progress`);
        return res.data;
    }

    async updateSetupProgress(data: UpdateSetupProgressDTO): Promise<SetupProgress> {
        const res = await axios.post(`${API_BASE_URL}/admin/setup/progress`, data);
        return res.data;
    }

    async validateSetupCompletion(): Promise<SetupValidationResponse> {
        const res = await axios.get(`${API_BASE_URL}/admin/setup/validate`);
        return res.data;
    }
}

export const adminSetupService: IAdminSetupService = USE_MOCK
    ? new MockAdminSetupService()
    : new RealAdminSetupService();
