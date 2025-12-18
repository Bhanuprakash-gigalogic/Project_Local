import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI, storesAPI } from '../services/api';
import { useZone } from '../context/ZoneContext';
import { mockSellers, mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';

// Inline Styles
const styles = {
  homePage: {
    backgroundColor: '#FAFAFA',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #E0E0E0',
    borderTopColor: '#8B4513',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  searchResultsHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px 0',
    marginBottom: '30px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  searchResultsTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchQuery: {
    color: '#FFD700',
    fontStyle: 'italic',
    textDecoration: 'underline',
  },
  searchResultsCount: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0',
    fontWeight: '500',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  productsSection: {
    marginBottom: '50px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    margin: '20px 0',
  },
  emptyStateText: {
    fontSize: '18px',
    color: '#666',
    margin: '10px 0',
  },
  emptyStateTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '10px 0',
  },
  heroBanner: {
    position: 'relative',
    height: '500px',
    overflow: 'hidden',
    marginBottom: '40px',
    borderRadius: '0 0 20px 20px',
  },
  heroBannerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  heroBrandSlide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0,
    transition: 'opacity 1s ease-in-out',
  },
  heroBrandSlideActive: {
    opacity: 1,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
  },
  heroBrandName: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#8B4513',
    padding: '16px 32px',
    borderRadius: '50px',
    fontSize: '24px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 2,
  },
  heroContent: {
    position: 'absolute',
    bottom: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    color: 'white',
    zIndex: 2,
    width: '100%',
    maxWidth: '800px',
    padding: '0 20px',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    margin: '0 0 16px 0',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
  },
  heroSubtitle: {
    fontSize: '24px',
    fontWeight: '400',
    margin: '0 0 32px 0',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
  },
  heroBtn: {
    padding: '16px 48px',
    fontSize: '18px',
    fontWeight: '600',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '24px',
  },
  sellersSection: {
    marginBottom: '50px',
    width: '100%',
  },
  sellersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Fixed 3 cards in a horizontal row
    gap: '20px',
    width: '100%',
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
    minWidth: 0, // Prevent grid blowout
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
  woodBrandsSection: {
    marginBottom: '50px',
  },
  woodBrandsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  woodBrandCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid #E0E0E0',
  },
  woodBrandCardActive: {
    borderColor: '#8B4513',
    boxShadow: '0 4px 12px rgba(139, 69, 19, 0.2)',
  },
  woodBrandImage: {
    width: '100%',
    height: '150px',
    overflow: 'hidden',
  },
  woodBrandImageImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  woodBrandInfo: {
    padding: '16px',
    textAlign: 'center',
  },
  woodBrandName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#8B4513',
  },
  ourProductsSection: {
    marginBottom: '50px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  viewAllLink: {
    fontSize: '16px',
    color: '#8B4513',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
  productCategoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  productCategoryCard: {
    backgroundColor: 'white',
    border: '2px solid #E0E0E0',
    borderRadius: '12px',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    minHeight: '140px',
    textDecoration: 'none',
    color: 'inherit',
  },
  categoryIcon: {
    fontSize: '48px',
    lineHeight: 1,
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#8B4513',
    lineHeight: 1.4,
  },
  // Shop by Category styles
  shopByCategorySection: {
    padding: '20px 0',
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  shopByCategoryTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '16px',
    paddingLeft: '20px',
  },
  categoryScrollContainer: {
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  categoryScrollWrapper: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '8px',
  },
  categoryChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '24px',
    border: '2px solid #8B4513',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  categoryChipIcon: {
    fontSize: '18px',
  },
  categoryChipText: {
    fontSize: '14px',
    fontWeight: '600',
  },
  categoryChipWrapper: {
    position: 'relative',
  },
  categoryWithDropdown: {
    position: 'relative',
  },
  categoryChipArrow: {
    fontSize: '10px',
    marginLeft: '4px',
  },
  subcategoryDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    minWidth: '200px',
    zIndex: 1000,
    overflow: 'hidden',
  },
  subcategoryItem: {
    display: 'block',
    padding: '12px 16px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    borderBottom: '1px solid #F0F0F0',
  },
};

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { zone, loading: zoneLoading } = useZone();

  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [defaultStore, setDefaultStore] = useState(null);

  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);

  const shopByCategories = [
    {
      id: 'all',
      name: 'All',
      icon: '🏠',
      link: '/categories'
    },
    {
      id: 'living',
      name: 'Living',
      icon: '🛋️',
      link: '/categories/living'
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      icon: '🛏️',
      link: '/categories/bedroom'
    },
    {
      id: 'mattress',
      name: 'Mattress',
      icon: '🛏️',
      link: '/categories/mattress'
    },
    {
      id: 'dining',
      name: 'Dining',
      icon: '🍽️',
      link: '/categories/dining'
    },
    {
      id: 'storage',
      name: 'Storage',
      icon: '🗄️',
      link: '/categories/storage'
    },
    {
      id: 'study-office',
      name: 'Study & Office',
      icon: '💼',
      link: '/categories/study-office'
    },
    {
      id: 'outdoor-balcony',
      name: 'Outdoor & Balcony',
      icon: '🌿',
      link: '/categories/outdoor-balcony'
    },
    {
      id: 'furnishings',
      name: 'Furnishings',
      icon: '🎨',
      link: '/categories/furnishings'
    },
    {
      id: 'lighting-decor',
      name: 'Lighting & Decor',
      icon: '💡',
      link: '/categories/lighting-decor'
    },
    {
      id: 'interiors',
      name: 'Interiors',
      icon: '🏡',
      link: '/categories/interiors'
    },
  ];

  const brands = [
    { id: 'teak_wood', name: 'Teak wood', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop' },
    { id: 'indian_rosewood', name: 'Indian Rosewood', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop' },
    { id: 'sal_wood', name: 'Sal wood', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=150&h=150&fit=crop' },
    { id: 'cedar_wood', name: 'Cedar wood', image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=150&h=150&fit=crop' },
    { id: 'mahogany', name: 'Mahogany', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=150&h=150&fit=crop' },
    { id: 'oak', name: 'Oak', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150&h=150&fit=crop' },
    { id: 'mulberry_wood', name: 'Mulberry wood', image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=150&h=150&fit=crop' },
    { id: 'deodar_wood', name: 'Deodar Wood', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=150&h=150&fit=crop' },
    { id: 'jackwood', name: 'Jackwood', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=150&h=150&fit=crop' },
  ];

  // Auto-scroll hero banner every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBrandIndex((i) => (i + 1) % brands.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!zoneLoading) fetchData();
  }, [zoneLoading, zone, searchParams, selectedBrand]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const storeRes = await storesAPI.getDefaultStore();
      const storeData = storeRes.data.data || storeRes.data;
      setDefaultStore(storeData);

      const params = {
        page: 1,
        limit: 24,
        ...(searchParams.get('search') && { q: searchParams.get('search') }),
        ...(selectedBrand && { brand: selectedBrand }),
        ...(zone?.zone_id && { zone_id: zone.zone_id }),
        ...(storeData?.store_id && { store_id: storeData.store_id }),
      };

      const productRes = await productsAPI.getProducts(params);
      const allProducts = productRes.data.data || productRes.data || [];

      setProducts(allProducts);
      setFeaturedProducts(allProducts.slice(0, 4));

      // New Arrivals
      try {
        const newRes = await productsAPI.getNewArrivals({
          zone_id: zone?.zone_id,
          limit: 8,
        });
        setNewArrivals(newRes.data.data || []);
      } catch {
        setNewArrivals(allProducts.slice(4, 12));
      }

      // Top Sellers
      try {
        const sellerRes = await storesAPI.getTopSellers({
          zone_id: zone?.zone_id,
          limit: 6,
        });
        const sellers = sellerRes.data.data || [];
        console.log('🏪 Top Sellers loaded:', sellers.length, sellers);
        setTopSellers(sellers);
      } catch {
        // Use centralized mock data
        const mockSellersList = Object.values(mockSellers);
        console.log('🏪 Using mock sellers:', mockSellersList.length, mockSellersList);
        setTopSellers(mockSellersList);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Get all products from centralized database
    const allMockProducts = [];
    Object.keys(mockProducts).forEach(subcatId => {
      const products = mockProducts[subcatId];
      allMockProducts.push(...products);
    });

    // Filter by search query if present
    const searchQuery = searchParams.get('search');
    let filteredProducts = allMockProducts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const queryWords = query.split(' ').filter(word => word.length > 0);

      // Score each product based on relevance
      const scoredProducts = allMockProducts.map(product => {
        const name = product.name.toLowerCase();
        const description = (product.description || '').toLowerCase();
        const sellerName = (product.seller_name || '').toLowerCase();

        let score = 0;

        // Exact match in name gets highest score
        if (name === query) score += 1000;

        // All query words in name
        if (queryWords.every(word => name.includes(word))) score += 500;

        // Partial match in name
        queryWords.forEach(word => {
          if (name.includes(word)) score += 100;
          if (description.includes(word)) score += 10;
          if (sellerName.includes(word)) score += 5;
        });

        // Bonus for word order matching
        if (name.includes(query)) score += 200;

        return { product, score };
      });

      // Filter products with score > 0 and sort by score
      filteredProducts = scoredProducts
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
    }

    // If no search results, show a subset of all products
    const productsToShow = filteredProducts.length > 0
      ? filteredProducts.slice(0, 24)
      : allMockProducts.slice(0, 4);

    setProducts(productsToShow);
    setFeaturedProducts(productsToShow.slice(0, 4));
    setNewArrivals(productsToShow.slice(4, 12));
  };

  if (loading || zoneLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingSpinner}></div>
        <p>{zoneLoading ? 'Detecting your location...' : 'Loading...'}</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const searchQuery = searchParams.get('search');

  return (
    <div style={styles.homePage}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Search Results Header */}
      {searchQuery && (
        <section style={styles.searchResultsHeader}>
          <div style={styles.container}>
            <h2 style={styles.searchResultsTitle}>
              🔍 Search Results for: <span style={styles.searchQuery}>"{searchQuery}"</span>
            </h2>
            <p style={styles.searchResultsCount}>
              {products.length > 0
                ? `Found ${products.length} product${products.length !== 1 ? 's' : ''}`
                : 'No products found'}
            </p>
          </div>
        </section>
      )}

      {/* Hero Banner - Hide when searching */}
      {!searchQuery && (
        <section style={styles.heroBanner}>
          <div style={styles.heroBannerBackground}>
            {brands.map((brand, index) => (
              <div
                key={brand.id}
                style={{
                  ...styles.heroBrandSlide,
                  ...(index === currentBrandIndex ? styles.heroBrandSlideActive : {}),
                  backgroundImage: `url(${brand.image})`,
                }}
              />
            ))}
            <div style={styles.heroOverlay} />
          </div>

          <div style={styles.heroBrandName}>{brands[currentBrandIndex].name}</div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Winter Offer Sale</h1>
            <p style={styles.heroSubtitle}>All furnitures</p>
            <button style={styles.heroBtn}>Shop Now</button>
          </div>
        </section>
      )}

      <div style={styles.container}>

        {/* SEARCH RESULTS - Show when searching */}
        {searchQuery && (
          <section style={styles.productsSection}>
            {products.length > 0 ? (
              <div style={styles.productsGrid}>
                {products.map((p) => (
                  <ProductCard key={p.id || p.product_id} product={p} />
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateTitle}>No products found for "{searchQuery}"</p>
                <p style={styles.emptyStateText}>Try searching with different keywords</p>
              </div>
            )}
          </section>
        )}

        {/* Top Sellers - Hide when searching */}
        {!searchQuery && topSellers.length > 0 && (
          <section style={styles.sellersSection}>
            <h2 style={styles.sectionTitle}>Top Sellers</h2>

            <div style={styles.sellersGrid}>
              {topSellers.slice(0, 3).map((seller) => (
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
                    <div style={styles.verifiedBadge}>
                      <span>✓</span>
                      <span>Verified</span>
                    </div>

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
          </section>
        )}

        {/* Wood Brands - Hide when searching */}
        {!searchQuery && (
          <section style={styles.woodBrandsSection}>
            <h2 style={styles.sectionTitle}>Popular Wood Brands</h2>

            <div style={styles.woodBrandsGrid}>
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  style={{
                    ...styles.woodBrandCard,
                    ...(selectedBrand === brand.id ? styles.woodBrandCardActive : {}),
                  }}
                  onClick={() => {
                    if (brand.id === 'teak_wood') return navigate('/seller/1');
                    setSelectedBrand(selectedBrand === brand.id ? null : brand.id);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={styles.woodBrandImage}>
                    <img src={brand.image} alt={brand.name} style={styles.woodBrandImageImg} />
                  </div>
                  <div style={styles.woodBrandInfo}>
                    <span style={styles.woodBrandName}>{brand.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Shop by Category - Hide when searching */}
        {!searchQuery && (
          <section style={styles.shopByCategorySection}>
            <h2 style={styles.shopByCategoryTitle}>Shop by Category</h2>

            <div style={styles.categoryScrollContainer}>
              <div style={styles.categoryScrollWrapper}>
                {shopByCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={cat.link}
                    style={{
                      ...styles.categoryChip,
                      backgroundColor: cat.id === 'all' ? '#8B4513' : 'white',
                      color: cat.id === 'all' ? 'white' : '#8B4513',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#8B4513';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = cat.id === 'all' ? '#8B4513' : 'white';
                      e.currentTarget.style.color = cat.id === 'all' ? 'white' : '#8B4513';
                    }}
                  >
                    <span style={styles.categoryChipIcon}>{cat.icon}</span>
                    <span style={styles.categoryChipText}>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured - Hide when searching */}
        {!searchQuery && (
          <section style={styles.productsSection}>
            <h2 style={styles.sectionTitle}>Featured For You</h2>

            <div style={styles.productsGrid}>
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals - Hide when searching */}
        {!searchQuery && (
          <section style={styles.productsSection}>
            <h2 style={styles.sectionTitle}>New Arrivals</h2>

            <div style={styles.productsGrid}>
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Home;
