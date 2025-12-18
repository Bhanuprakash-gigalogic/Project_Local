import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { categoriesAPI, productsAPI } from '../services/api';
import { useZone } from '../context/ZoneContext';
import { MdChevronRight, MdArrowBack, MdStore } from 'react-icons/md';
import { mockSubcategories } from '../data/mockData';

const Subcategories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { zone, loading: zoneLoading } = useZone();
  
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!zoneLoading) {
      fetchSubcategories();
    }
  }, [categoryId, zoneLoading, zone]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const params = {
        zone_id: zone?.zone_id,
        only_with_products: true,
      };

      const response = await categoriesAPI.getCategoryTree(params);
      const allCategories = response.data.data || response.data || [];
      
      // Find the selected category and its subcategories
      const selectedCategory = allCategories.find(
        (cat) => cat.category_id === parseInt(categoryId)
      );
      
      setCategory(selectedCategory);
      setSubcategories(selectedCategory?.subcategories || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      loadMockSubcategories();
    } finally {
      setLoading(false);
    }
  };

  const loadMockSubcategories = () => {
    const categoryData = mockSubcategories[categoryId] || mockSubcategories[1];
    setCategory({ name: categoryData.name, icon: categoryData.icon });
    setSubcategories(categoryData.subcategories);
  };

  if (loading || zoneLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading subcategories...</p>
      </div>
    );
  }

  return (
    <div className="subcategories-page page-container">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/categories" className="breadcrumb-link">
            <MdArrowBack /> Categories
          </Link>
          <MdChevronRight className="breadcrumb-separator" />
          <span className="breadcrumb-current">
            {category?.icon} {category?.name}
          </span>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-icon-large">{category?.icon}</div>
            <div>
              <h1 className="page-title">{category?.name}</h1>
              <p className="page-subtitle">
                Choose a subcategory to view sellers and products
              </p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="subcategories-grid">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.subcategory_id}
              to={`/category/${categoryId}/subcategory/${subcategory.subcategory_id}/sellers`}
              className="subcategory-card"
            >
              <div className="subcategory-image">
                <img src={subcategory.image} alt={subcategory.name} />
                <div className="subcategory-overlay"></div>
              </div>

              <div className="subcategory-content">
                <div className="subcategory-icon-badge">{subcategory.icon}</div>
                <h3 className="subcategory-name">{subcategory.name}</h3>
                
                <div className="subcategory-stats">
                  <div className="subcategory-stat">
                    <MdStore />
                    <span>{subcategory.seller_count || 0} Sellers</span>
                  </div>
                  <span className="subcategory-stat-divider">•</span>
                  <span className="subcategory-stat">
                    {subcategory.total_products || 0} Products
                  </span>
                </div>

                <div className="subcategory-action">
                  <span>View Sellers</span>
                  <MdChevronRight />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {subcategories.length === 0 && (
          <div className="empty-state">
            <p>No subcategories available in your area</p>
            <button onClick={() => navigate('/categories')} className="btn btn-primary">
              Browse Other Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subcategories;

