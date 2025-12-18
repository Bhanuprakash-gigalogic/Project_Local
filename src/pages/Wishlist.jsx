import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

// Inline Styles
const styles = {
  wishlistPage: {
    backgroundColor: '#FAFAFA',
    minHeight: '100vh',
    padding: '40px 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '32px',
  },
  emptyWishlist: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 12px 0',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 24px 0',
  },
  btn: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#8B4513',
    color: 'white',
  },
  wishlistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  wishlistItem: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  itemImage: {
    width: '100%',
    height: '280px',
    objectFit: 'cover',
  },
  itemDetails: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  itemName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  itemRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  star: {
    fontSize: '14px',
    color: '#E0E0E0',
  },
  starFilled: {
    fontSize: '14px',
    color: '#FFA500',
  },
  ratingCount: {
    fontSize: '13px',
    color: '#999',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  itemPrice: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#8B4513',
  },
  originalPrice: {
    fontSize: '16px',
    color: '#999',
    textDecoration: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#22C55E',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  itemActions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },
  addToCartBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  removeBtn: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#DC2626',
    border: '2px solid #DC2626',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    const success = await addToCart(product, 1, product.seller_id);
    if (success) {
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(product.id || product.product_id);
      navigate('/cart');
    }
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={i <= rating ? styles.starFilled : styles.star}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (wishlist.length === 0) {
    return (
      <div style={styles.wishlistPage}>
        <div style={styles.container}>
          <div style={styles.emptyWishlist}>
            <div style={styles.emptyIcon}>❤️</div>
            <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
            <p style={styles.emptyText}>Add products you love to your wishlist!</p>
            <button
              style={styles.btn}
              onClick={() => navigate('/')}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0522D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B4513'}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wishlistPage}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>My Wishlist</h1>
        <p style={{fontSize: '16px', color: '#666', marginBottom: '24px'}}>
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </p>

        <div style={styles.wishlistGrid}>
          {wishlist.map((item) => {
            const product = item.product || item;
            const productId = product.product_id || product.id;
            const productName = product.product_name || product.name;
            const productPrice = product.price;
            const productImage = product.image_url || product.image;
            const productRating = product.rating;
            const productReviewCount = product.review_count;

            return (
              <div
                key={productId}
                style={styles.wishlistItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div
                  style={{cursor: 'pointer'}}
                  onClick={() => navigate(`/product/${productId}`)}
                >
                  <img
                    src={productImage || 'https://via.placeholder.com/300x300?text=Product'}
                    alt={productName}
                    style={styles.itemImage}
                  />
                </div>

                <div style={styles.itemDetails}>
                  <h3
                    style={{...styles.itemName, cursor: 'pointer'}}
                    onClick={() => navigate(`/product/${productId}`)}
                  >
                    {productName}
                  </h3>

                  {productRating && (
                    <div style={styles.itemRating}>
                      <div style={styles.stars}>{renderStars(productRating)}</div>
                      <span style={styles.ratingCount}>({productReviewCount || 0})</span>
                    </div>
                  )}

                  <div style={styles.priceSection}>
                    <span style={styles.itemPrice}>
                      ₹{productPrice?.toLocaleString('en-IN')}
                    </span>
                    {product.mrp && product.mrp > productPrice && (
                      <>
                        <span style={styles.originalPrice}>
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                        {product.discount && (
                          <span style={styles.discountBadge}>{product.discount}% OFF</span>
                        )}
                      </>
                    )}
                  </div>

                  <div style={styles.itemActions}>
                    <button
                      style={styles.addToCartBtn}
                      onClick={() => handleAddToCart(product)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0522D'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B4513'}
                    >
                      Add to Cart
                    </button>

                    <button
                      style={styles.removeBtn}
                      onClick={() => handleRemove(productId)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#DC2626';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#DC2626';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

