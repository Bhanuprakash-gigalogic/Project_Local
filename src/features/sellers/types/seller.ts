export type SellerStatus = 'pending' | 'approved' | 'rejected';

export interface SellerDoc {
    id: string;
    name: string;
    type: string; // e.g. 'business_license', 'id_proof'
    url: string;
    uploadedAt: string;
}

export interface SellerApplication {
    id: string;
    applicantName: string;
    email: string;
    businessName: string;
    businessType: string;
    phone: string;
    status: SellerStatus;
    avatar: string;
    submittedAt: string;
    documents: SellerDoc[];
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    notes?: string;
    rejectionReason?: string;
}

export interface SellerFilter {
    status: SellerStatus;
    search?: string;
    page?: number;
}

export interface PaginatedSellers {
    data: SellerApplication[];
    meta: {
        total: number;
        page: number;
        totalPages: number;
    };
}
