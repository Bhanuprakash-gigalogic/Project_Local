export interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    status: 'draft' | 'live';
    position: number; // Order in carousel
    createdAt: string;
}

export interface CategoryLanding {
    id: string; // Category ID
    name: string;
    slug: string;
    isConfigured: boolean; // Has landing page content
    bannerUrl?: string;
}

export interface SectionConfig {
    id: string;
    type: 'hero' | 'products' | 'categories' | 'banner_grid';
    title: string;
    isEnabled: boolean;
    order: number;
}

export interface HomeConfig {
    sections: SectionConfig[];
    seoTitle: string;
    seoDescription: string;
}
