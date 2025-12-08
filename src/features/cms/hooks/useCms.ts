import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner, CategoryLanding, HomeConfig } from '../types/cms';

// Mock Data
let MOCK_BANNERS: Banner[] = [
    { id: 'b1', title: 'Summer Sale', imageUrl: 'https://placehold.co/600x200?text=Summer+Sale', linkUrl: '/sale', status: 'live', position: 1, createdAt: new Date().toISOString() },
    { id: 'b2', title: 'New Arrivals', imageUrl: 'https://placehold.co/600x200?text=New+Arrivals', linkUrl: '/new', status: 'live', position: 2, createdAt: new Date().toISOString() },
    { id: 'b3', title: 'Draft Banner', imageUrl: 'https://placehold.co/600x200?text=Draft', linkUrl: '/test', status: 'draft', position: 3, createdAt: new Date().toISOString() },
];

let MOCK_CATEGORIES: CategoryLanding[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `cat-${i}`,
    name: `Category ${i + 1}`,
    slug: `category-${i + 1}`,
    isConfigured: i % 3 === 0, // Some configured, some not
    bannerUrl: i % 3 === 0 ? `https://placehold.co/300x100?text=Cat+${i + 1}` : undefined
}));

let MOCK_HOME_CONFIG: HomeConfig = {
    seoTitle: "My E-Commerce Store",
    seoDescription: "Best products online",
    sections: [
        { id: 's1', type: 'hero', title: 'Main Hero Carousel', isEnabled: true, order: 1 },
        { id: 's2', type: 'categories', title: 'Shop by Category', isEnabled: true, order: 2 },
        { id: 's3', type: 'products', title: 'Featured Products', isEnabled: true, order: 3 },
        { id: 's4', type: 'banner_grid', title: 'Promo Banners', isEnabled: false, order: 4 },
    ]
};

// --- Banners ---

export const useGetBanners = (search?: string) => {
    return useQuery({
        queryKey: ['cms-banners', search],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            if (search) {
                const q = search.toLowerCase();
                return MOCK_BANNERS.filter(b => b.title.toLowerCase().includes(q));
            }
            return MOCK_BANNERS;
        }
    });
};

export const usePublishBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: 'live' | 'draft' }) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const idx = MOCK_BANNERS.findIndex(b => b.id === id);
            if (idx > -1) {
                MOCK_BANNERS[idx].status = status;
            }
            return { id, status };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cms-banners'] });
        }
    });
};

export const useDeleteBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            MOCK_BANNERS = MOCK_BANNERS.filter(b => b.id !== id);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cms-banners'] });
        }
    });
};

export const useCreateBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (vars: Partial<Banner>) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newBanner: Banner = {
                id: `b-${Date.now()}`,
                title: vars.title || 'New Banner',
                imageUrl: vars.imageUrl || 'https://placehold.co/600x200',
                linkUrl: vars.linkUrl || '#',
                status: 'draft',
                position: MOCK_BANNERS.length + 1,
                createdAt: new Date().toISOString()
            };
            MOCK_BANNERS.push(newBanner);
            return newBanner;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cms-banners'] });
        }
    });
};


// --- Categories ---

export const useGetCategoriesLanding = (search?: string) => {
    return useQuery({
        queryKey: ['cms-categories', search],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            if (search) {
                const q = search.toLowerCase();
                return MOCK_CATEGORIES.filter(c => c.name.toLowerCase().includes(q));
            }
            return MOCK_CATEGORIES;
        }
    });
};


// --- Home Config ---

export const useGetHomeConfig = () => {
    return useQuery({
        queryKey: ['cms-home-config'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 400));
            return MOCK_HOME_CONFIG;
        }
    });
};

export const useUpdateHomeConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newConfig: HomeConfig) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            MOCK_HOME_CONFIG = newConfig;
            return newConfig;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cms-home-config'] });
        }
    });
};
