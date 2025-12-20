import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import { useZone } from '../context/ZoneContext';
import { MdChevronRight, MdCategory } from 'react-icons/md';
import { mockCategories } from '../data/mockData';

const Categories = () => {
  const navigate = useNavigate();
  const { zone, loading: zoneLoading } = useZone();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!zoneLoading) {
      fetchCategories();
    }
  }, [zoneLoading, zone]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = {
        zone_id: zone?.zone_id,
        only_with_products: true,
      };

      const response = await categoriesAPI.getCategoryTree(params);
      const categoryData = response.data.data || response.data || [];
      setCategories(categoryData);
    } catch (error) {
      // Only log non-network errors
      if (error.code !== 'ERR_NETWORK' && !error.message?.includes('Network Error')) {
        console.error('Error fetching categories:', error);
      } else {
        console.log('📡 Backend unavailable - Using mock categories');
      }
      // Load mock data for development
      loadMockCategories();
    } finally {
      setLoading(false);
    }
  };

  const loadMockCategories = () => {
    // Load all categories for "All" view
    const allCategories = [
      {
        category_id: 'living',
        name: 'Living Room',
        icon: '🛋️',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
        subcategory_count: 10,
        total_products: 212
      },
      {
        category_id: 'bedroom',
        name: 'Bedroom',
        icon: '🛏️',
        image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop',
        subcategory_count: 12,
        total_products: 419
      },
      {
        category_id: 'mattress',
        name: 'Mattress',
        icon: '🛏️',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
        subcategory_count: 8,
        total_products: 156
      },
      {
        category_id: 'dining',
        name: 'Dining',
        icon: '🍽️',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop',
        subcategory_count: 9,
        total_products: 178
      },
      {
        category_id: 'storage',
        name: 'Storage',
        icon: '🗄️',
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
        subcategory_count: 11,
        total_products: 245
      },
      {
        category_id: 'study-office',
        name: 'Study & Office',
        icon: '💼',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
        subcategory_count: 8,
        total_products: 272
      },
      {
        category_id: 'outdoor-balcony',
        name: 'Outdoor & Balcony',
        icon: '🌿',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
        subcategory_count: 8,
        total_products: 243
      },
      {
        category_id: 'furnishings',
        name: 'Furnishings',
        icon: '🎨',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop',
        subcategory_count: 8,
        total_products: 400
      },
      {
        category_id: 'lighting-decor',
        name: 'Lighting & Décor',
        icon: '💡',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
        subcategory_count: 10,
        total_products: 440
      },
      {
        category_id: 'interiors',
        name: 'Interiors',
        icon: '🏡',
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
        subcategory_count: 10,
        total_products: 322
      },
    ];
    setCategories(allCategories);
  };

  if (loading || zoneLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>{zoneLoading ? 'Detecting your location...' : 'Loading categories...'}</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="page-header-content">
            <MdCategory className="page-icon" />
            <div>
              <h1 className="page-title">Our Categories</h1>
              <p className="page-subtitle">Browse products by category</p>
            </div>
          </div>
        </div>

        {/* Categories Grid - 4 columns, padding 0 24px */}
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              to={`/categories/${category.category_id}`}
              className="category-card"
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay"></div>
              </div>

              <div className="category-content">
                <div className="category-icon-badge">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>

                <div className="category-stats">
                  <span className="category-stat">
                    {category.subcategory_count || 0} Subcategories
                  </span>
                  <span className="category-stat-divider">•</span>
                  <span className="category-stat">
                    {category.total_products || 0} Products
                  </span>
                </div>

                <div className="category-action">
                  <span>Explore</span>
                  <MdChevronRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;

