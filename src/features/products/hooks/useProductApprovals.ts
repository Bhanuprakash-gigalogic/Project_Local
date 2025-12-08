import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductFilter } from '../types/product';

// Mock Data
const generateMockProducts = (count: number): Product[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `prod-${i + 1}`,
        title: `Premium Item ${i + 1} - High Quality`,
        description: `This is a detailed description for product ${i + 1}. It features high durability, excellent craftsmanship, and is sourced from top-tier materials. Perfect for daily use or special occasions.`,
        category: i % 3 === 0 ? 'Electronics' : i % 3 === 1 ? 'Fashion' : 'Home & Garden',
        brand: `Brand ${String.fromCharCode(65 + (i % 5))}`,
        price: 99.99 + (i * 10),
        status: i % 10 === 0 ? 'active' : i % 5 === 0 ? 'rejected' : 'pending',
        images: [
            { id: 'img1', url: `https://placehold.co/400x400?text=Product+${i + 1}`, isPrimary: true },
            { id: 'img2', url: `https://placehold.co/400x400?text=Side+${i + 1}`, isPrimary: false },
            { id: 'img3', url: `https://placehold.co/400x400?text=Detail+${i + 1}`, isPrimary: false },
        ],
        variants: [
            { id: 'v1', sku: `SKU-${i}-A`, name: 'Default', price: 99.99 + (i * 10), stock: 50 + i },
        ],
        seller: {
            id: `sell-${i}`,
            businessName: `Seller Enterprise ${i}`,
            contactEmail: `seller${i}@example.com`
        },
        createdAt: new Date().toISOString(),
        submittedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
        specs: {
            "Material": "Cotton Blend",
            "Weight": "500g",
            "Warranty": "1 Year"
        }
    }));
};

const MOCK_PRODUCTS = generateMockProducts(40);

export const useGetPendingProducts = (filter: ProductFilter) => {
    return useQuery({
        queryKey: ['products-pending', filter],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 800));

            let filtered = MOCK_PRODUCTS;

            if (filter.status && filter.status !== 'all') {
                filtered = filtered.filter(p => p.status === filter.status);
            }

            if (filter.search) {
                const q = filter.search.toLowerCase();
                filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(q) ||
                    p.seller.businessName.toLowerCase().includes(q)
                );
            }

            return {
                data: filtered,
                meta: {
                    total: filtered.length,
                    page: 1,
                    totalPages: Math.ceil(filtered.length / 10) // Simplified pagination
                }
            };
        }
    });
};

export const useGetProductApprovalById = (id: string | null) => {
    return useQuery({
        queryKey: ['product-approval', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return MOCK_PRODUCTS.find(p => p.id === id) || null;
        },
        enabled: !!id
    });
};

export const useApproveProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
            if (idx > -1) MOCK_PRODUCTS[idx].status = 'active';
            return { id, status: 'active' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products-pending'] });
            queryClient.invalidateQueries({ queryKey: ['product-approval'] });
        }
    });
};

export const useRejectProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
            if (idx > -1) {
                MOCK_PRODUCTS[idx].status = 'rejected';
                MOCK_PRODUCTS[idx].rejectionReason = reason;
            }
            return { id, status: 'rejected' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products-pending'] });
            queryClient.invalidateQueries({ queryKey: ['product-approval'] });
        }
    });
};
