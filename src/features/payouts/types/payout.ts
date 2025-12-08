export type PayoutStatus = 'pending' | 'completed' | 'failed' | 'processing';

export interface Payout {
    id: string;
    vendorId: string;
    vendorName: string;
    vendorEmail: string;
    amount: number;
    status: PayoutStatus;
    date: string;
    referenceId?: string; // e.g. bank transaction ID
    orderId?: string; // Optional if payout is per order
}

export interface PayoutOverview {
    totalPaid: number;
    pendingAmount: number;
    avgProcessTime: string; // e.g. "2 days"
    nextPayoutDate: string;
}

export interface VendorCommission {
    vendorId: string;
    vendorName: string;
    rate: number; // percentage
}

export interface CommissionSettings {
    defaultRate: number; // global default percentage
    allowVendorSpecific: boolean;
    vendorRates: VendorCommission[];
}

export interface PayoutFilter {
    status?: PayoutStatus | 'all';
    search?: string;
    page?: number;
}

export interface PaginatedPayouts {
    data: Payout[];
    meta: {
        total: number;
        page: number;
        totalPages: number;
    };
}
