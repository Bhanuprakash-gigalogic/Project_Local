import axios from 'axios';
import {
    Category,
    CategoryTree,
    CreateCategoryDTO,
    UpdateCategoryDTO,
    ReorderCategoryDTO,
    DeleteCategoryResponse,
    CategoryTreeResponse,
    CategoryFilters
} from '../types/category';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

// Helper to build tree from flat list
function buildTree(categories: Category[]): CategoryTree[] {
    const map = new Map<string, CategoryTree>();
    const roots: CategoryTree[] = [];

    // Initialize all nodes
    categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [], level: 0 });
    });

    // Build tree structure
    categories.forEach(cat => {
        const node = map.get(cat.id)!;
        if (cat.parent_id === null) {
            roots.push(node);
        } else {
            const parent = map.get(cat.parent_id);
            if (parent) {
                node.level = parent.level + 1;
                parent.children.push(node);
            }
        }
    });

    // Sort by sort_order
    const sortTree = (nodes: CategoryTree[]) => {
        nodes.sort((a, b) => a.sort_order - b.sort_order);
        nodes.forEach(node => sortTree(node.children));
    };
    sortTree(roots);

    return roots;
}

export interface ICategoryService {
    getCategoryTree(zoneId?: string): Promise<CategoryTreeResponse>;
    getCategories(filters: CategoryFilters): Promise<Category[]>;
    getCategory(id: string): Promise<Category>;
    createCategory(data: CreateCategoryDTO): Promise<Category>;
    updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category>;
    reorderCategory(id: string, data: ReorderCategoryDTO): Promise<Category>;
    deleteCategory(id: string): Promise<DeleteCategoryResponse>;
}

class MockCategoryService implements ICategoryService {
    private categories: Category[] = [
        {
            id: '1',
            name: 'Electronics',
            slug: 'electronics',
            parent_id: null,
            is_active: true,
            sort_order: 1,
            product_count: 150,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Smartphones',
            slug: 'smartphones',
            parent_id: '1',
            is_active: true,
            sort_order: 1,
            product_count: 45,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '3',
            name: 'Laptops',
            slug: 'laptops',
            parent_id: '1',
            is_active: true,
            sort_order: 2,
            product_count: 30,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '4',
            name: 'Clothing',
            slug: 'clothing',
            parent_id: null,
            is_active: true,
            sort_order: 2,
            product_count: 200,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '5',
            name: 'Men',
            slug: 'men',
            parent_id: '4',
            is_active: true,
            sort_order: 1,
            product_count: 80,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '6',
            name: 'Women',
            slug: 'women',
            parent_id: '4',
            is_active: true,
            sort_order: 2,
            product_count: 120,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '7',
            name: 'Home & Garden',
            slug: 'home-garden',
            parent_id: null,
            is_active: true,
            sort_order: 3,
            product_count: 0, // Empty category for testing deletion
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    async getCategoryTree(zoneId?: string): Promise<CategoryTreeResponse> {
        await new Promise(r => setTimeout(r, 500));

        const tree = buildTree(this.categories);
        return {
            categories: tree,
            total: this.categories.length,
        };
    }

    async getCategories(filters: CategoryFilters): Promise<Category[]> {
        await new Promise(r => setTimeout(r, 300));

        let filtered = [...this.categories];

        if (filters.parent_id !== undefined) {
            filtered = filtered.filter(c => c.parent_id === filters.parent_id);
        }
        if (filters.is_active !== undefined) {
            filtered = filtered.filter(c => c.is_active === filters.is_active);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(search) ||
                c.slug.toLowerCase().includes(search)
            );
        }

        return filtered;
    }

    async getCategory(id: string): Promise<Category> {
        await new Promise(r => setTimeout(r, 300));
        const category = this.categories.find(c => c.id === id);
        if (!category) throw new Error('Category not found');
        return category;
    }

    async createCategory(data: CreateCategoryDTO): Promise<Category> {
        await new Promise(r => setTimeout(r, 800));

        const newCategory: Category = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            sort_order: data.sort_order ?? 999,
            product_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        this.categories.push(newCategory);
        return newCategory;
    }

    async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
        await new Promise(r => setTimeout(r, 600));

        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Category not found');

        this.categories[index] = {
            ...this.categories[index],
            ...data,
            updated_at: new Date().toISOString()
        };

        return this.categories[index];
    }

    async reorderCategory(id: string, data: ReorderCategoryDTO): Promise<Category> {
        await new Promise(r => setTimeout(r, 500));

        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Category not found');

        this.categories[index].sort_order = data.new_sort_order;
        if (data.new_parent_id !== undefined) {
            this.categories[index].parent_id = data.new_parent_id;
        }
        this.categories[index].updated_at = new Date().toISOString();

        return this.categories[index];
    }

    async deleteCategory(id: string): Promise<DeleteCategoryResponse> {
        await new Promise(r => setTimeout(r, 500));

        const category = this.categories.find(c => c.id === id);
        if (!category) throw new Error('Category not found');

        // Check if category has products
        if (category.product_count && category.product_count > 0) {
            return {
                success: false,
                message: `Cannot delete category with ${category.product_count} products. Please move or delete products first.`,
                product_count: category.product_count,
                can_delete: false,
            };
        }

        // Check if category has children
        const hasChildren = this.categories.some(c => c.parent_id === id);
        if (hasChildren) {
            return {
                success: false,
                message: 'Cannot delete category with subcategories. Please delete subcategories first.',
                can_delete: false,
            };
        }

        // Safe to delete
        this.categories = this.categories.filter(c => c.id !== id);
        return {
            success: true,
            message: 'Category deleted successfully',
            can_delete: true,
        };
    }
}

class RealCategoryService implements ICategoryService {
    async getCategoryTree(zoneId?: string): Promise<CategoryTreeResponse> {
        const params = zoneId ? `?zone_id=${zoneId}` : '';
        const res = await axios.get(`${API_BASE_URL}/categories/tree${params}`);
        return res.data;
    }

    async getCategories(filters: CategoryFilters): Promise<Category[]> {
        const params = new URLSearchParams();
        if (filters.parent_id !== undefined) params.append('parent_id', filters.parent_id || '');
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.zone_id) params.append('zone_id', filters.zone_id);

        const res = await axios.get(`${API_BASE_URL}/categories?${params}`);
        return res.data;
    }

    async getCategory(id: string): Promise<Category> {
        const res = await axios.get(`${API_BASE_URL}/categories/${id}`);
        return res.data;
    }

    async createCategory(data: CreateCategoryDTO): Promise<Category> {
        const res = await axios.post(`${API_BASE_URL}/categories`, data);
        return res.data;
    }

    async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
        const res = await axios.put(`${API_BASE_URL}/categories/${id}`, data);
        return res.data;
    }

    async reorderCategory(id: string, data: ReorderCategoryDTO): Promise<Category> {
        const res = await axios.patch(`${API_BASE_URL}/categories/${id}/reorder`, data);
        return res.data;
    }

    async deleteCategory(id: string): Promise<DeleteCategoryResponse> {
        try {
            await axios.delete(`${API_BASE_URL}/categories/${id}`);
            return {
                success: true,
                message: 'Category deleted successfully',
                can_delete: true,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete category',
                product_count: error.response?.data?.product_count,
                can_delete: false,
            };
        }
    }
}

export const categoryService: ICategoryService = USE_MOCK ? new MockCategoryService() : new RealCategoryService();
