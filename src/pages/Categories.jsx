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
    setCategories(mockCategories);
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
    <div className="categories-page page-container">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <MdCategory className="page-icon" />
            <div>
              <h1 className="page-title">Our Categories</h1>
              <p className="page-subtitle">Browse products by category</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              to={`/category/${category.category_id}/subcategories`}
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

