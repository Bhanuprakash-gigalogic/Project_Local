/**
 * Security utilities for XSS protection, input sanitization, and secure storage
 */

// XSS Protection - Sanitize HTML content
export const sanitizeHTML = (dirty: string): string => {
    const div = document.createElement('div');
    div.textContent = dirty;
    return div.innerHTML;
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
};

// Validate email
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate URL
export const isValidURL = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

// Secure Storage with encryption (basic implementation)
class SecureStorage {
    private prefix = 'secure_';

    // Simple XOR encryption (for demo - use proper encryption in production)
    private encrypt(text: string, key: string): string {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    }

    private decrypt(encrypted: string, key: string): string {
        const text = atob(encrypted);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    setItem(key: string, value: string): void {
        const encryptionKey = this.getEncryptionKey();
        const encrypted = this.encrypt(value, encryptionKey);
        localStorage.setItem(this.prefix + key, encrypted);
    }

    getItem(key: string): string | null {
        const encrypted = localStorage.getItem(this.prefix + key);
        if (!encrypted) return null;

        try {
            const encryptionKey = this.getEncryptionKey();
            return this.decrypt(encrypted, encryptionKey);
        } catch {
            return null;
        }
    }

    removeItem(key: string): void {
        localStorage.removeItem(this.prefix + key);
    }

    clear(): void {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    private getEncryptionKey(): string {
        // In production, use a more secure key derivation
        return 'admin-dashboard-key-2024';
    }
}

export const secureStorage = new SecureStorage();

// CSRF Token Management
export const generateCSRFToken = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const getCSRFToken = (): string => {
    let token = secureStorage.getItem('csrf_token');
    if (!token) {
        token = generateCSRFToken();
        secureStorage.setItem('csrf_token', token);
    }
    return token;
};

// Content Security Policy helpers
export const getCSPDirectives = () => {
    return {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https:', 'blob:'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'connect-src': ["'self'", process.env.VITE_API_URL || 'http://localhost:3000'],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
    };
};

// Rate limiting helper (client-side)
class RateLimiter {
    private requests: Map<string, number[]> = new Map();
    private limit: number;
    private windowMs: number;

    constructor(limit: number = 100, windowMs: number = 60000) {
        this.limit = limit;
        this.windowMs = windowMs;
    }

    check(key: string): boolean {
        const now = Date.now();
        const timestamps = this.requests.get(key) || [];

        // Remove old timestamps
        const validTimestamps = timestamps.filter(ts => now - ts < this.windowMs);

        if (validTimestamps.length >= this.limit) {
            return false;
        }

        validTimestamps.push(now);
        this.requests.set(key, validTimestamps);
        return true;
    }

    reset(key: string): void {
        this.requests.delete(key);
    }
}

export const rateLimiter = new RateLimiter();

// Password strength checker
export const checkPasswordStrength = (password: string): {
    score: number;
    feedback: string[];
} => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Password should be at least 8 characters');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Include uppercase letters');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('Include numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push('Include special characters');

    return { score, feedback };
};
