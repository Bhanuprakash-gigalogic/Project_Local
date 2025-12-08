export type ProductStatus = 'pending' | 'active' | 'rejected' | 'draft';

export interface ProductImage {
    id: string;
    url: string;
    isPrimary: boolean;
}

export interface ProductVariant {
    id: string;
    sku: string;
    name: string; // e.g., "Size: M, Color: Red"
    price: number;
    stock: number;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number; // Base price
    compareAtPrice?: number;
    status: ProductStatus;
    images: ProductImage[];
    variants: ProductVariant[];

    seller: {
        id: string;
        businessName: string;
        contactEmail: string;
    };

    createdAt: string;
    submittedAt: string;
    rejectionReason?: string;

    // Specifications (Key-Value)
    specs: Record<string, string>;
}

export interface ProductFilter {
    status?: ProductStatus | 'all';
    search?: string;
    page?: number;
}

export interface PaginatedProducts {
    data: Product[];
    meta: {
        total: number;
        page: number;
        totalPages: number;
    };
}
