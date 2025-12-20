import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { storesAPI, productsAPI } from '../services/api';
import { mockSellers, mockProducts, getProductsBySubcategoryAndSeller, getSubcategoryIdFromSlug } from '../data/mockData';
import ProductCard from '../components/ProductCard';

// Inline Styles - Matching Home page "Featured For You" layout
const styles = {
  sellerStorePage: {
    backgroundColor: '#F5F5DC',
    minHeight: '100vh',
    paddingTop: '20px',
    paddingBottom: '40px',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#666',
  },
  errorState: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#C7511F',
  },
  sellerHeader: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  sellerName: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0F1111',
    margin: '0 0 12px 0',
  },
  sellerRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  ratingStars: {
    fontSize: '16px',
    color: '#FFA41C',
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: '14px',
    color: '#565959',
  },
  sellerDescription: {
    fontSize: '16px',
    color: '#565959',
    lineHeight: '1.6',
    margin: '0',
  },
  productsSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '24px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns like Featured For You
    gap: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#565959',
  },
};

const SellerStore = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const subcategoryId = searchParams.get('subcategory');

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, [id, subcategoryId]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);

      // Build product query params
      const productParams = {
        seller_id: id,
        ...(subcategoryId && { subcategory_id: subcategoryId }),
      };

      const [sellerRes, productsRes] = await Promise.all([
        storesAPI.getSellerById(id),
        productsAPI.getProducts(productParams),
      ]);

      setSeller(sellerRes.data);
      setProducts(productsRes.data.products || []);
    } catch (error) {
      // Only log non-network errors
      if (error.code !== 'ERR_NETWORK' && !error.message?.includes('Network Error')) {
        console.error('Error fetching seller data:', error);
      } else {
        console.log('📡 Backend unavailable - Using mock seller data');
      }

      // Use centralized mock seller data
      const sellerData = mockSellers[parseInt(id)] || mockSellers[1];
      setSeller({
        id: sellerData.seller_id,
        name: sellerData.business_name,
        rating: sellerData.rating,
        review_count: sellerData.review_count,
        description: sellerData.description,
      });

      // Get products from centralized database
      let allProducts = [];

      if (subcategoryId) {
        // Get products for specific subcategory
        // Pass subcategoryId directly - getProductsBySubcategoryAndSeller handles both slug and numeric IDs
        const subcategoryProducts = getProductsBySubcategoryAndSeller(subcategoryId, parseInt(id));
        allProducts = subcategoryProducts;
      } else {
        // Get all products for this seller across all subcategories
        Object.keys(mockProducts).forEach(subcat => {
          const products = getProductsBySubcategoryAndSeller(parseInt(subcat), parseInt(id));
          allProducts = [...allProducts, ...products];
        });
      }

      setProducts(allProducts);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.sellerStorePage}>
        <div style={styles.container}>
          <div style={styles.loadingState}>Loading seller information...</div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div style={styles.sellerStorePage}>
        <div style={styles.container}>
          <div style={styles.errorState}>Seller not found</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.sellerStorePage}>
      <div style={styles.container}>
        {/* Seller Header */}
        <div style={styles.sellerHeader}>
          <h1 style={styles.sellerName}>{seller.name}</h1>
          <div style={styles.sellerRating}>
            <span style={styles.ratingStars}>⭐ {seller.rating}</span>
            <span style={styles.ratingCount}>({seller.review_count} reviews)</span>
          </div>
          {seller.description && (
            <p style={styles.sellerDescription}>{seller.description}</p>
          )}
        </div>

        {/* Products Section */}
        <div style={styles.productsSection}>
          <h2 style={styles.sectionTitle}>
            {subcategoryId ? 'Products in this category' : 'All Products'}
          </h2>

          {products.length > 0 ? (
            <div style={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No products available{subcategoryId ? ' in this category' : ''}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerStore;

