import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';

// Inline Styles
const styles = {
  productCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    zIndex: 2,
  },
  wishlistBtnActive: {
    backgroundColor: '#FFE5E5',
    transform: 'scale(1.1)',
  },
  productInfo: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
  },
  productRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
  productPriceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  productPrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#8B4513',
  },
  originalPrice: {
    fontSize: '14px',
    color: '#999',
    textDecoration: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#22C55E',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  addToCartBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: 'auto',
  },
  addToCartBtnAdding: {
    backgroundColor: '#22C55E',
  },
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return; // Prevent double clicks

    setIsAdding(true);
    try {
      const success = await addToCart(product, 1, product.seller_id);

      // Redirect to cart page after adding to cart
      if (success) {
        // Small delay to show "Added!" state
        setTimeout(() => {
          navigate('/cart');
        }, 500);
      } else {
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingToWishlist) return; // Prevent double clicks

    setIsAddingToWishlist(true);
    try {
      await addToWishlist(product);
    } finally {
      setIsAddingToWishlist(false);
    }
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

  return (
    <Link
      to={`/product/${product.id}`}
      style={styles.productCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      <div style={styles.productImageContainer}>
        <img
          src={product.image || 'https://via.placeholder.com/300x300?text=Product'}
          alt={product.name}
          style={styles.productImage}
        />
        <button
          style={{
            ...styles.wishlistBtn,
            ...(isInWishlist(product.id) ? styles.wishlistBtnActive : {})
          }}
          onClick={handleWishlist}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = isInWishlist(product.id) ? 'scale(1.1)' : 'scale(1)'}
        >
          {isInWishlist(product.id) ? (
            <MdFavorite style={{ fontSize: '20px', color: '#FF1493' }} />
          ) : (
            <MdFavoriteBorder style={{ fontSize: '20px', color: '#666' }} />
          )}
        </button>
      </div>

      <div style={styles.productInfo}>
        <h3 style={styles.productName}>{product.name}</h3>

        {product.rating && (
          <div style={styles.productRating}>
            <div style={styles.stars}>{renderStars(product.rating)}</div>
            <span style={styles.ratingCount}>({product.review_count || 0})</span>
          </div>
        )}

        <div style={styles.productPriceSection}>
          <span style={styles.productPrice}>₹{product.price?.toLocaleString('en-IN')}</span>
          {(product.mrp || product.original_price) && (product.mrp > product.price || product.original_price > product.price) && (
            <>
              <span style={styles.originalPrice}>₹{(product.mrp || product.original_price).toLocaleString('en-IN')}</span>
              {product.discount && (
                <span style={styles.discountBadge}>{product.discount}% OFF</span>
              )}
            </>
          )}
        </div>

        <button
          style={{
            ...styles.addToCartBtn,
            ...(isAdding ? styles.addToCartBtnAdding : {})
          }}
          onClick={handleAddToCart}
          disabled={isAdding}
          onMouseEnter={(e) => {
            if (!isAdding) e.currentTarget.style.backgroundColor = '#A0522D';
          }}
          onMouseLeave={(e) => {
            if (!isAdding) e.currentTarget.style.backgroundColor = '#8B4513';
          }}
        >
          {isAdding ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

