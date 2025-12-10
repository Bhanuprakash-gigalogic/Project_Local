// Admin authentication and setup types

export interface AdminUser {
    id: string;
    email: string;
    phone?: string;
    name: string;
    role: 'super_admin' | 'admin';
    created_at: string;
}

export interface AdminLoginDTO {
    email_or_phone: string;
    password: string;
    remember_me?: boolean;
}

export interface AdminAuthResponse {
    token: string;
    user: AdminUser;
    expires_at: string;
}

export enum SetupStep {
    ZONES = 'zones',
    CATEGORIES = 'categories',
    BANNERS = 'banners',
    SELLER_ALLOCATION = 'seller_allocation',
    COMPLETE = 'complete'
}

export enum SetupStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

export interface SetupProgress {
    current_step: SetupStep;
    status: SetupStatus;
    completed_steps: SetupStep[];
    zones_count: number;
    categories_count: number;
    banners_count: number;
    allocated_sellers_count: number;
    is_setup_complete: boolean;
    updated_at: string;
}

export interface UpdateSetupProgressDTO {
    step: SetupStep;
    mark_complete?: boolean;
}

export interface SetupValidationResponse {
    is_valid: boolean;
    missing_requirements: string[];
    can_proceed: boolean;
}
