export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface RefundItem {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    amount: number;
}

export interface RefundRequest {
    id: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    status: RefundStatus;
    reason: string;
    description: string;
    images: string[];

    items: RefundItem[];

    requestedAt: string;
    processedAt?: string;
    rejectionReason?: string;
}

export interface RefundFilter {
    status?: RefundStatus | 'all';
    search?: string;
    page?: number;
}

export interface PaginatedRefunds {
    data: RefundRequest[];
    meta: {
        total: number;
        page: number;
        totalPages: number;
    };
}
