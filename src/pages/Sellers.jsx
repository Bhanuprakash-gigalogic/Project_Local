import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storesAPI } from '../services/api';
import { useZone } from '../context/ZoneContext';
import { mockSellers } from '../data/mockData';

// Inline Styles - Matching Home page Top Sellers layout
const styles = {
  sellersPage: {
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
    paddingTop: '20px',
    paddingBottom: '40px',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '30px',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#666',
  },
  sellersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns in a row
    gap: '20px',
  },
  sellerCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E0E0E0',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  sellerBanner: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  sellerBannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  sellerCardContent: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  verifiedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#067D62',
    fontWeight: '500',
  },
  sellerName: {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0',
    color: '#0F1111',
  },
  sellerRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#0F1111',
  },
  sellerProducts: {
    fontSize: '14px',
    color: '#C7511F',
    margin: '0',
    fontWeight: '600',
  },
  sellerLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#565959',
  },
  viewProductsLink: {
    fontSize: '14px',
    color: '#007185',
    fontWeight: '500',
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};

const Sellers = () => {
  const { zone, loading: zoneLoading } = useZone();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!zoneLoading) {
      fetchSellers();
    }
  }, [zone, zoneLoading]);

  const fetchSellers = async () => {
    try {
      setLoading(true);

      // Pass zone_id if available
      const zoneId = zone?.zone_id;
      if (zoneId) {
        console.log('🗺️ Fetching sellers for zone:', zoneId);
      }

      const response = await storesAPI.getTopSellers(zoneId);
      setSellers(response.data.sellers || []);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      // Use centralized mock data directly
      setSellers(Object.values(mockSellers));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.sellersPage}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading sellers...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.sellersPage}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Top Sellers</h1>

        <div style={styles.sellersGrid}>
          {sellers.map((seller) => (
            <div
              key={seller.seller_id}
              style={styles.sellerCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Seller Banner Image */}
              <div style={styles.sellerBanner}>
                <img
                  src={seller.banner_image || seller.logo || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'}
                  alt={seller.business_name}
                  style={styles.sellerBannerImg}
                />
              </div>

              {/* Seller Info */}
              <div style={styles.sellerCardContent}>
                {/* Verified Badge */}
                {seller.verified && (
                  <div style={styles.verifiedBadge}>
                    <span>✓</span>
                    <span>Verified</span>
                  </div>
                )}

                {/* Seller Name */}
                <h3 style={styles.sellerName}>{seller.business_name}</h3>

                {/* Rating */}
                <div style={styles.sellerRating}>
                  <span>⭐</span>
                  <span>{seller.rating || 4.8}({seller.review_count || 245} reviews)</span>
                </div>

                {/* Product Count */}
                <div style={styles.sellerProducts}>
                  📦 {seller.product_count || 89} Products
                </div>

                {/* Location */}
                <div style={styles.sellerLocation}>
                  <span>📍</span>
                  <span>{seller.city || 'Bangalore'}, {seller.state || 'Karnataka'}</span>
                </div>

                {/* View Products Link */}
                <Link
                  to={`/seller/${seller.seller_id}`}
                  style={styles.viewProductsLink}
                >
                  View Products <span>›</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sellers;

