import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { storesAPI, categoriesAPI } from '../services/api';
import { useZone } from '../context/ZoneContext';
import { MdChevronRight, MdArrowBack, MdStar, MdStore, MdVerified } from 'react-icons/md';
import { mockSubcategories, getSellersBySubcategory } from '../data/mockData';

const SubcategorySellers = () => {
  const { categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();
  const { zone, loading: zoneLoading } = useZone();
  
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!zoneLoading) {
      fetchSellers();
    }
  }, [categoryId, subcategoryId, zoneLoading, zone]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      
      // Fetch category tree to get category and subcategory names
      const categoryResponse = await categoriesAPI.getCategoryTree({
        zone_id: zone?.zone_id,
      });
      const allCategories = categoryResponse.data.data || [];
      const selectedCategory = allCategories.find(cat => cat.category_id === parseInt(categoryId));
      const selectedSubcategory = selectedCategory?.subcategories?.find(
        sub => sub.subcategory_id === parseInt(subcategoryId)
      );
      
      setCategory(selectedCategory);
      setSubcategory(selectedSubcategory);

      // Fetch sellers for this subcategory
      const sellersResponse = await storesAPI.getStoresByCategory({
        zone_id: zone?.zone_id,
        subcategory_id: subcategoryId,
      });
      
      const sellersData = sellersResponse.data.data || sellersResponse.data || [];
      setSellers(sellersData);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      loadMockSellers();
    } finally {
      setLoading(false);
    }
  };

  const loadMockSellers = () => {
    // Get sellers for this subcategory
    const sellersData = getSellersBySubcategory(subcategoryId);
    setSellers(sellersData);

    // Get category and subcategory info
    const categoryData = mockSubcategories[categoryId];
    if (categoryData) {
      setCategory({ name: categoryData.name, icon: categoryData.icon });
      const subcategoryData = categoryData.subcategories.find(
        sub => sub.subcategory_id === parseInt(subcategoryId)
      );
      if (subcategoryData) {
        setSubcategory({ name: subcategoryData.name, icon: subcategoryData.icon });
      }
    }
  };

  if (loading || zoneLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading sellers...</p>
      </div>
    );
  }

  return (
    <div className="subcategory-sellers-page page-container">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/categories" className="breadcrumb-link">Categories</Link>
          <MdChevronRight className="breadcrumb-separator" />
          <Link to={`/category/${categoryId}/subcategories`} className="breadcrumb-link">
            {category?.icon} {category?.name}
          </Link>
          <MdChevronRight className="breadcrumb-separator" />
          <span className="breadcrumb-current">
            {subcategory?.icon} {subcategory?.name}
          </span>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-icon-large">{subcategory?.icon}</div>
            <div>
              <h1 className="page-title">{subcategory?.name} Sellers</h1>
              <p className="page-subtitle">
                {sellers.length} seller{sellers.length !== 1 ? 's' : ''} in your area
              </p>
            </div>
          </div>
        </div>

        {/* Sellers Grid */}
        <div className="sellers-grid">
          {sellers.map((seller) => (
            <Link
              key={seller.seller_id}
              to={`/seller/${seller.seller_id}?subcategory=${subcategoryId}`}
              className="seller-card"
            >
              <div className="seller-header">
                <div className="seller-logo">
                  <img src={seller.logo || 'https://via.placeholder.com/100'} alt={seller.business_name} />
                </div>
                {seller.verified && (
                  <div className="seller-verified-badge">
                    <MdVerified /> Verified
                  </div>
                )}
              </div>

              <div className="seller-content">
                <h3 className="seller-name">{seller.business_name}</h3>
                
                <div className="seller-rating">
                  <MdStar className="star-icon" />
                  <span className="rating-value">{seller.rating || 4.5}</span>
                  <span className="rating-count">({seller.review_count || 0} reviews)</span>
                </div>

                <div className="seller-stats">
                  <div className="seller-stat">
                    <MdStore />
                    <span>{seller.product_count || 0} Products</span>
                  </div>
                </div>

                {seller.location && (
                  <div className="seller-location">📍 {seller.location}</div>
                )}

                <div className="seller-action">
                  <span>View Products</span>
                  <MdChevronRight />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sellers.length === 0 && (
          <div className="empty-state">
            <MdStore className="empty-icon" />
            <p>No sellers available in your area for this subcategory</p>
            <button onClick={() => navigate(`/category/${categoryId}/subcategories`)} className="btn btn-primary">
              Browse Other Subcategories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategorySellers;

