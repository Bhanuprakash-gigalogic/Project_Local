import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { mockProducts, getProductReviews } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';

// Inline Styles for Amazon-style Product Details
const styles = {
  productPage: {
    backgroundColor: '#F5F0E8',
    minHeight: '100vh',
    padding: '20px 0',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  productLayout: {
    display: 'grid',
    gridTemplateColumns: '500px 1fr 350px',
    gap: '30px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  // Left Column - Image Gallery
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mainImage: {
    width: '100%',
    height: '500px',
    objectFit: 'contain',
    backgroundColor: '#FAFAFA',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '20px',
  },
  thumbnailGallery: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    border: '2px solid #E0E0E0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  thumbnailActive: {
    borderColor: '#8B4513',
  },
  // Middle Column - Product Info
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  productTitle: {
    fontSize: '24px',
    fontWeight: '400',
    color: '#0F1111',
    lineHeight: '1.4',
    margin: 0,
  },
  sellerLink: {
    fontSize: '14px',
    color: '#007185',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #E0E0E0',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  star: {
    fontSize: '18px',
    color: '#FFA41C',
  },
  starEmpty: {
    fontSize: '18px',
    color: '#E0E0E0',
  },
  ratingText: {
    fontSize: '14px',
    color: '#007185',
    cursor: 'pointer',
  },
  priceSection: {
    paddingBottom: '16px',
    borderBottom: '1px solid #E0E0E0',
  },
  priceLabel: {
    fontSize: '14px',
    color: '#565959',
    marginBottom: '4px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    marginTop: '4px',
  },
  price: {
    fontSize: '28px',
    fontWeight: '400',
    color: '#B12704',
  },
  mrp: {
    fontSize: '14px',
    color: '#565959',
    textDecoration: 'line-through',
  },
  discount: {
    fontSize: '14px',
    color: '#CC0C39',
    fontWeight: '600',
  },
  infoRow: {
    display: 'flex',
    gap: '8px',
    fontSize: '14px',
    color: '#0F1111',
  },
  infoLabel: {
    fontWeight: '600',
    minWidth: '120px',
  },
  infoValue: {
    color: '#565959',
  },
  stockBadge: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#007600',
  },
  outOfStockBadge: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#B12704',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#0F1111',
  },
  descriptionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#0F1111',
  },
  // Right Column - Buy Box
  buyBox: {
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
    position: 'sticky',
    top: '100px',
    height: 'fit-content',
  },
  buyBoxPrice: {
    fontSize: '28px',
    fontWeight: '400',
    color: '#B12704',
    marginBottom: '8px',
  },
  buyBoxMrp: {
    fontSize: '13px',
    color: '#565959',
    textDecoration: 'line-through',
    marginBottom: '4px',
  },
  buyBoxDiscount: {
    fontSize: '13px',
    color: '#CC0C39',
    fontWeight: '600',
    marginBottom: '16px',
  },
  buyBoxDelivery: {
    fontSize: '14px',
    color: '#0F1111',
    marginBottom: '12px',
  },
  buyBoxStock: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#007600',
    marginBottom: '16px',
  },
  quantitySelector: {
    marginBottom: '16px',
  },
  quantityLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '8px',
    display: 'block',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    backgroundColor: '#F0F2F2',
    width: 'fit-content',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F1111',
    transition: 'all 0.2s ease',
  },
  qtyValue: {
    fontSize: '16px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  addToCartBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#FFD814',
    border: '1px solid #FCD200',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F1111',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
  },
  buyNowBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#FFA41C',
    border: '1px solid #FF8F00',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F1111',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
  },
  wishlistBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0F1111',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  secureTransaction: {
    fontSize: '12px',
    color: '#007185',
    marginTop: '12px',
    textAlign: 'center',
  },
  // Tabs Section
  tabsSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '30px',
  },
  tabHeaders: {
    display: 'flex',
    gap: '24px',
    borderBottom: '2px solid #E0E0E0',
    marginBottom: '24px',
  },
  tabHeader: {
    padding: '12px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#565959',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabHeaderActive: {
    color: '#8B4513',
    borderBottomColor: '#8B4513',
  },
  tabContent: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#0F1111',
  },
  // Similar Products Section
  similarSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '24px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    fontSize: '18px',
    color: '#565959',
  },
  // Write Review Section
  writeReviewSection: {
    backgroundColor: '#F7F7F7',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '30px',
    border: '1px solid #E0E0E0',
  },
  reviewFormTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '20px',
    marginTop: 0,
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D5D9D9',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#0F1111',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  formTextarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D5D9D9',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#0F1111',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  ratingInput: {
    display: 'flex',
    gap: '8px',
    fontSize: '24px',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: '#FFD814',
    border: '1px solid #FCD200',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F1111',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  // Message Seller Section
  messageSellerSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #E0E0E0',
  },
  messageSectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '20px',
    marginTop: 0,
  },
  // Reviews Tab Content
  reviewsTabContent: {
    padding: '0',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  reviewItem: {
    padding: '20px',
    backgroundColor: '#FAFAFA',
    borderRadius: '8px',
    border: '1px solid #E0E0E0',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  reviewUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F1111',
  },
  verifiedBadge: {
    fontSize: '12px',
    color: '#067D62',
    backgroundColor: '#E6F4F1',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  reviewRating: {
    display: 'flex',
    gap: '4px',
  },
  reviewDate: {
    fontSize: '12px',
    color: '#565959',
    marginBottom: '8px',
  },
  reviewTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F1111',
    marginTop: '8px',
    marginBottom: '8px',
  },
  reviewComment: {
    fontSize: '14px',
    color: '#0F1111',
    lineHeight: '1.6',
  },
  // Reviews Section (Bottom)
  reviewsSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  reviewsHeader: {
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid #E0E0E0',
  },
  averageRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  ratingNumber: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#0F1111',
  },
  totalReviews: {
    fontSize: '14px',
    color: '#565959',
  },
  reviewCard: {
    padding: '20px',
    backgroundColor: '#FAFAFA',
    borderRadius: '8px',
    border: '1px solid #E0E0E0',
    marginBottom: '16px',
  },
  reviewText: {
    fontSize: '14px',
    color: '#0F1111',
    lineHeight: '1.6',
    margin: '12px 0',
  },
  reviewImages: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  reviewImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #E0E0E0',
  },
  reviewFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    fontSize: '12px',
    color: '#565959',
  },
  helpfulCount: {
    color: '#067D62',
  },
  btnViewAllReviews: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'white',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F1111',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.2s ease',
  },
  // Star Rating
  starInteractive: {
    cursor: 'pointer',
    fontSize: '24px',
    transition: 'all 0.2s ease',
  },
  starFilled: {
    color: '#FFA41C',
  },
  starUnfilled: {
    color: '#E0E0E0',
  },
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      // Fetch product details
      const productRes = await productsAPI.getProductById(id);
      const productData = productRes.data.data || productRes.data;
      setProduct(productData);

      // Initialize selected variation with first option of each variation type
      if (productData.variations && productData.variations.length > 0) {
        const initialVariation = {};
        productData.variations.forEach(variation => {
          if (variation.options && variation.options.length > 0) {
            initialVariation[variation.type] = variation.options[0];
          }
        });
        setSelectedVariation(initialVariation);
      }

      // Fetch similar products (12 similar products from same/different sellers)
      try {
        const similarRes = await productsAPI.getSimilarProducts(id);
        const similarData = similarRes.data.data || similarRes.data;
        setSimilarProducts(Array.isArray(similarData) ? similarData : similarData.products || []);
      } catch (err) {
        console.log('Similar products not available:', err.message);
      }

      // Fetch related products (frequently bought together)
      try {
        const relatedRes = await productsAPI.getRelatedProducts(id);
        const relatedData = relatedRes.data.data || relatedRes.data;
        setRelatedProducts(Array.isArray(relatedData) ? relatedData : relatedData.products || []);
      } catch (err) {
        console.log('Related products not available:', err.message);
      }

      // Fetch reviews (paginated reviews + photos)
      try {
        const reviewsRes = await productsAPI.getProductReviews(id, { page: 1, limit: 10 });
        const reviewsData = reviewsRes.data.data || reviewsRes.data;
        setReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData.items || []);
      } catch (err) {
        console.log('Reviews not available:', err.message);
        // Use mock reviews as fallback
        const mockReviewsData = getProductReviews(parseInt(id));
        setReviews(mockReviewsData);
      }

    } catch (error) {
      // Only log non-network errors
      if (error.code !== 'ERR_NETWORK' && !error.message?.includes('Network Error')) {
        console.error('Error fetching product details:', error);
      } else {
        console.log('📡 Backend unavailable - Using mock product data');
      }

      // Mock data fallback - search in centralized database
      let foundProduct = null;
      Object.keys(mockProducts).forEach(subcatId => {
        const products = mockProducts[subcatId];
        const match = products.find(p => p.id === parseInt(id));
        if (match) {
          foundProduct = match;
        }
      });

      if (foundProduct) {
        setProduct({
          product_id: foundProduct.id,
          id: foundProduct.id,
          name: foundProduct.name,
          title: foundProduct.name,
          price: foundProduct.price,
          mrp: foundProduct.mrp,
          original_price: foundProduct.mrp,
          rating: foundProduct.rating,
          review_count: foundProduct.review_count,
          total_reviews: foundProduct.review_count,
          description: foundProduct.description,
          image: foundProduct.image,
          gallery: [foundProduct.image],
          seller: {
            seller_id: foundProduct.seller_id,
            name: foundProduct.seller_name,
            rating: 4.8,
          },
          in_stock: foundProduct.in_stock,
          discount: foundProduct.discount,
          subcategory_id: foundProduct.subcategory_id,
        });

        // Load mock reviews for this product
        const mockReviewsData = getProductReviews(foundProduct.id);
        setReviews(mockReviewsData);
      } else {
        // Default fallback if product not found
        setProduct({
          product_id: id,
          id: id,
          name: 'Product Not Found',
          title: 'Product Not Found',
          price: 0,
          mrp: 0,
          original_price: 0,
          rating: 0,
          review_count: 0,
          total_reviews: 0,
          description: 'This product is currently unavailable.',
          image: 'https://via.placeholder.com/600',
          gallery: ['https://via.placeholder.com/600'],
          seller: {
            seller_id: 'seller_001',
            name: 'Unknown Seller',
            rating: 0,
          },
          in_stock: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    // Add to cart with selected variation
    await addToCart(product, quantity, product.seller?.seller_id, selectedVariation);
  };

  const handleBuyNow = () => {
    // Store product data in sessionStorage for checkout flow
    const productId = product.product_id || product.id;

    // Store checkout mode
    sessionStorage.setItem('checkoutMode', 'buynow');

    // Store complete product data with quantity
    const checkoutProduct = {
      product_id: productId,
      id: productId,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      seller: product.seller,
      in_stock: product.in_stock,
      quantity: quantity,
    };

    sessionStorage.setItem('buyNowProduct', JSON.stringify(checkoutProduct));

    // Navigate to delivery address selection (same flow as cart)
    navigate('/checkout/address');
  };

  const handleAddToWishlist = async () => {
    // Add to wishlist with selected variation
    await addToWishlist(product, selectedVariation);
  };

  const handleVariationChange = (variationType, value) => {
    setSelectedVariation(prev => ({
      ...prev,
      [variationType]: value
    }));
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      const starStyle = {
        ...(interactive ? styles.starInteractive : {}),
        ...(isFilled ? styles.starFilled : styles.starUnfilled),
      };

      stars.push(
        <span
          key={i}
          style={starStyle}
          onClick={() => interactive && onRate && onRate(i)}
          onMouseEnter={(e) => interactive && (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }
    alert('Review submitted successfully!');
    setUserRating(0);
    setReviewText('');
    setReviewTitle('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert('Message sent to seller!');
    setMessage('');
  };

  if (loading) {
    return <div style={styles.loading}>Loading product details...</div>;
  }

  if (!product) {
    return <div style={styles.loading}>Product not found</div>;
  }

  const discountPercent = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div style={styles.productPage}>
      <div style={styles.container}>
        {/* Main Product Layout - 3 Columns */}
        <div style={styles.productLayout}>
          {/* LEFT COLUMN - Image Gallery */}
          <div style={styles.imageSection}>
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.name}
              style={styles.mainImage}
            />
            {product.gallery && product.gallery.length > 1 && (
              <div style={styles.thumbnailGallery}>
                {product.gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      ...styles.thumbnail,
                      ...(index === 0 ? styles.thumbnailActive : {})
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* MIDDLE COLUMN - Product Info */}
          <div style={styles.infoSection}>
            <h1 style={styles.productTitle}>{product.name}</h1>

            <Link
              to={`/seller/${product.seller?.seller_id}`}
              style={styles.sellerLink}
            >
              Visit the {product.seller?.name || product.seller_name || 'Seller'} Store
            </Link>

            <div style={styles.ratingSection}>
              <div style={styles.stars}>{renderStars(product.rating || 0)}</div>
              <span style={styles.ratingText}>
                {product.rating} ({product.review_count || 0} ratings)
              </span>
            </div>

            <div style={styles.priceSection}>
              <div style={styles.priceLabel}>Price:</div>
              <div style={styles.priceRow}>
                <span style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span style={styles.mrp}>
                      M.R.P: ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span style={styles.discount}>({discountPercent}% off)</span>
                  </>
                )}
              </div>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Inclusive of all taxes</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>EMI</span>
              <span style={styles.infoValue}>
                starts at ₹{Math.round(product.price / 24).toLocaleString('en-IN')}/month
              </span>
            </div>

            <div style={styles.description}>
              <h3 style={styles.descriptionTitle}>About this item</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>
          </div>

          {/* RIGHT COLUMN - Buy Box */}
          <div style={styles.buyBox}>
            <div style={styles.buyBoxPrice}>
              ₹{product.price?.toLocaleString('en-IN')}
            </div>
            {product.mrp && product.mrp > product.price && (
              <>
                <div style={styles.buyBoxMrp}>
                  M.R.P: ₹{product.mrp.toLocaleString('en-IN')}
                </div>
                <div style={styles.buyBoxDiscount}>
                  Save ₹{(product.mrp - product.price).toLocaleString('en-IN')} ({discountPercent}%)
                </div>
              </>
            )}

            <div style={styles.buyBoxDelivery}>
              <strong>FREE delivery</strong> 19 - 29 December
            </div>

            <div style={styles.buyBoxDelivery}>
              📍 Deliver to Vizag - Hyderabad 530072
            </div>

            {product.in_stock !== false ? (
              <div style={styles.buyBoxStock}>In Stock</div>
            ) : (
              <div style={styles.outOfStockBadge}>Out of Stock</div>
            )}

            <div style={styles.quantitySelector}>
              <label style={styles.quantityLabel}>Quantity:</label>
              <div style={styles.quantityControl}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  −
                </button>
                <span style={styles.qtyValue}>{quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQuantity(quantity + 1)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  +
                </button>
              </div>
            </div>

            <button
              style={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={product.in_stock === false}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7CA00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD814'}
            >
              Add to Cart
            </button>

            <button
              style={styles.buyNowBtn}
              onClick={handleBuyNow}
              disabled={product.in_stock === false}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FA8900'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFA41C'}
            >
              Buy Now
            </button>

            <button
              style={{
                ...styles.wishlistBtn,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onClick={() => addToWishlist(product)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFA'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              {isInWishlist(product.id) ? (
                <>
                  <MdFavorite style={{ fontSize: '20px', color: '#FF1493' }} />
                  <span>In Wishlist</span>
                </>
              ) : (
                <>
                  <MdFavoriteBorder style={{ fontSize: '20px', color: '#666' }} />
                  <span>Add to Wishlist</span>
                </>
              )}
            </button>

            <div style={styles.secureTransaction}>
              🔒 Secure transaction
            </div>

            <div style={{...styles.infoRow, marginTop: '16px', flexDirection: 'column', gap: '8px'}}>
              <div style={{fontSize: '12px', color: '#565959'}}>
                <strong>Ships from:</strong> Amazon
              </div>
              <div style={{fontSize: '12px', color: '#565959'}}>
                <strong>Sold by:</strong>{' '}
                <Link to={`/seller/${product.seller?.seller_id}`} style={styles.sellerLink}>
                  {product.seller?.name || product.seller_name}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div style={styles.tabsSection}>
          <div style={styles.tabHeaders}>
            <button
              style={{
                ...styles.tabHeader,
                ...(activeTab === 'description' ? styles.tabHeaderActive : {})
              }}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              style={{
                ...styles.tabHeader,
                ...(activeTab === 'specifications' ? styles.tabHeaderActive : {})
              }}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button
              style={{
                ...styles.tabHeader,
                ...(activeTab === 'reviews' ? styles.tabHeaderActive : {})
              }}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.review_count || 0})
            </button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'description' && (
              <div>
                <h3 style={styles.descriptionTitle}>Product Description</h3>
                <p style={{lineHeight: '1.6'}}>{product.description || 'No description available.'}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 style={styles.descriptionTitle}>Specifications</h3>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <tbody>
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} style={{borderBottom: '1px solid #E0E0E0'}}>
                          <td style={{padding: '12px 0', fontWeight: '600', width: '200px'}}>{key}</td>
                          <td style={{padding: '12px 0', color: '#565959'}}>{value}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr style={{borderBottom: '1px solid #E0E0E0'}}>
                          <td style={{padding: '12px 0', fontWeight: '600', width: '200px'}}>Material</td>
                          <td style={{padding: '12px 0', color: '#565959'}}>Premium Wood</td>
                        </tr>
                        <tr style={{borderBottom: '1px solid #E0E0E0'}}>
                          <td style={{padding: '12px 0', fontWeight: '600'}}>Finish</td>
                          <td style={{padding: '12px 0', color: '#565959'}}>Natural Polish</td>
                        </tr>
                        <tr style={{borderBottom: '1px solid #E0E0E0'}}>
                          <td style={{padding: '12px 0', fontWeight: '600'}}>Warranty</td>
                          <td style={{padding: '12px 0', color: '#565959'}}>1 Year</td>
                        </tr>
                        <tr style={{borderBottom: '1px solid #E0E0E0'}}>
                          <td style={{padding: '12px 0', fontWeight: '600'}}>Assembly Required</td>
                          <td style={{padding: '12px 0', color: '#565959'}}>No</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={styles.reviewsTabContent}>
                <h2 style={styles.sectionTitle}>Customer Reviews</h2>

                {/* Reviews List */}
                <div style={styles.reviewsList}>
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} style={styles.reviewItem}>
                        <div style={styles.reviewHeader}>
                          <div style={styles.reviewUser}>
                            <strong>{review.buyer_name || 'Anonymous'}</strong>
                            {review.verified_purchase && (
                              <span style={styles.verifiedBadge}>✓ Verified Purchase</span>
                            )}
                          </div>
                          <div style={styles.reviewRating}>
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div style={styles.reviewDate}>
                          {new Date(review.reviewed_at || review.created_at || review.date).toLocaleDateString()}
                        </div>
                        {review.title && <h4 style={styles.reviewTitle}>{review.title}</h4>}
                        <div style={styles.reviewComment}>{review.review || review.comment}</div>
                      </div>
                    ))
                  ) : (
                    <p style={{fontSize: '14px', color: '#565959', padding: '20px 0'}}>
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>

                {/* Write a Review */}
                <div style={styles.writeReviewSection}>
                  <h3 style={styles.reviewFormTitle}>Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Your Rating:</label>
                      <div style={styles.ratingInput}>
                        {renderStars(userRating, true, setUserRating)}
                      </div>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Review Title:</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Summarize your experience..."
                        required
                        style={styles.formInput}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Your Review:</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows="5"
                        required
                        style={styles.formTextarea}
                      />
                    </div>
                    <button
                      type="submit"
                      style={styles.submitBtn}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7CA00'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD814'}
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Send Message to Seller */}
        <div style={styles.messageSellerSection}>
          <h2 style={styles.messageSectionTitle}>Send Message to Seller</h2>
          <form onSubmit={handleSendMessage}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Your Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask the seller about this product..."
                rows="4"
                required
                style={styles.formTextarea}
              />
            </div>
            <button
              type="submit"
              style={styles.submitBtn}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7CA00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD814'}
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section style={styles.reviewsSection}>
            <div style={styles.reviewsHeader}>
              <h2 style={styles.sectionTitle}>Customer Reviews</h2>
              <div>
                <div style={styles.averageRating}>
                  <span style={styles.ratingNumber}>{product.rating || 0}</span>
                  <div style={styles.stars}>{renderStars(product.rating || 0)}</div>
                  <span style={styles.totalReviews}>{product.review_count || 0} reviews</span>
                </div>
              </div>
            </div>

            <div style={styles.reviewsList}>
              {reviews.slice(0, 5).map((review, index) => (
                <div key={index} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewUser}>
                      <strong>{review.buyer_name || 'Anonymous'}</strong>
                      {review.verified_purchase && (
                        <span style={styles.verifiedBadge}>✓ Verified Purchase</span>
                      )}
                    </div>
                    <div style={styles.stars}>{renderStars(review.rating)}</div>
                  </div>

                  {review.title && <h4 style={styles.reviewTitle}>{review.title}</h4>}
                  <p style={styles.reviewText}>{review.review}</p>

                  {review.images && review.images.length > 0 && (
                    <div style={styles.reviewImages}>
                      {review.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Review ${idx + 1}`} style={styles.reviewImage} />
                      ))}
                    </div>
                  )}

                  <div style={styles.reviewFooter}>
                    <span style={styles.reviewDate}>
                      {new Date(review.reviewed_at).toLocaleDateString()}
                    </span>
                    {review.helpful > 0 && (
                      <span style={styles.helpfulCount}>
                        👍 {review.helpful} found this helpful
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > 5 && (
              <button
                style={styles.btnViewAllReviews}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFA'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                View All {reviews.length} Reviews
              </button>
            )}
          </section>
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div style={styles.similarSection}>
            <h2 style={styles.sectionTitle}>Similar Products</h2>
            <div style={styles.productsGrid}>
              {similarProducts.slice(0, 4).map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

