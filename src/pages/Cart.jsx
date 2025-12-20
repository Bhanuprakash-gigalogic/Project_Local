import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MdArrowBack, MdDelete } from 'react-icons/md';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleCheckout = () => {
    navigate('/checkout/address');
  };

  const handleApplyCoupon = () => {
    // Simple coupon logic - you can expand this
    if (couponCode.toUpperCase() === 'SAVE25') {
      setDiscount(25);
      alert('Coupon applied! ₹25 discount');
    } else if (couponCode) {
      alert('Invalid coupon code');
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping - discount;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return (
      <div style={styles.cartPage}>
        <div style={styles.container}>
          <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate('/')}>
              <MdArrowBack />
            </button>
            <h1 style={styles.headerTitle}>My Cart</h1>
          </div>
          <div style={styles.emptyCart}>
            <div style={styles.emptyCartIcon}>🛒</div>
            <h2 style={styles.emptyCartTitle}>Your cart is empty</h2>
            <p style={styles.emptyCartText}>Add some products to get started!</p>
            <button style={{...styles.btn, ...styles.btnPrimary}} onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.cartPage}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            <MdArrowBack />
          </button>
          <h1 style={styles.headerTitle}>My Cart</h1>
        </div>

        {/* Cart Content */}
        <div style={styles.cartContent}>
          {/* Cart Items */}
          {cart.map((item, index) => {
            const product = item.product || item;
            const productId = product.product_id || product.id;
            const productName = product.product_name || product.name;
            const productPrice = product.price;
            const productImage = product.image_url || product.image;
            const quantity = item.quantity || 1;

            return (
              <div key={productId || index} style={styles.cartItem}>
                <img
                  src={productImage || 'https://via.placeholder.com/80'}
                  alt={productName}
                  style={styles.productImage}
                />

                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{productName}</h3>
                  <p style={styles.productVariant}>Variant: Default</p>
                  <p style={styles.productPrice}>
                    ₹{productPrice ? Number(productPrice).toLocaleString('en-IN') : '0'}
                  </p>

                  {/* Quantity Control */}
                  <div style={styles.quantityControl}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0F0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      −
                    </button>
                    <span style={styles.qtyValue}>{quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(productId, quantity + 1)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0F0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  style={styles.deleteBtn}
                  onClick={() => removeFromCart(productId)}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D32F2F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                >
                  <MdDelete />
                </button>
              </div>
            );
          })}

          {/* Coupon Section */}
          <div style={styles.couponSection}>
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={styles.couponInput}
              onFocus={(e) => e.currentTarget.style.borderColor = '#333'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
            />
            <button
              style={styles.applyBtn}
              onClick={handleApplyCoupon}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D0D0D0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8E8E8'}
            >
              Apply
            </button>
          </div>

          {/* Summary Section */}
          <div style={styles.summarySection}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal</span>
              <span style={styles.summaryValue}>
                ₹{Number(subtotal || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Shipping</span>
              <span style={styles.summaryValue}>
                ₹{Number(shipping || 0).toLocaleString('en-IN')}
              </span>
            </div>
            {discount > 0 && (
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Discount</span>
                <span style={styles.discountValue}>
                  -₹{Number(discount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Total */}
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>
                ₹{Number(total || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              style={styles.checkoutBtn}
              onClick={handleCheckout}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#234A3D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2D5F4F'}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Clean Cart Styles
const styles = {
  cartPage: {
    backgroundColor: '#F5F5DC',
    minHeight: '100vh',
    padding: '0',
  },
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: 'white',
    minHeight: '100vh',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #E8E8E8',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    color: '#333',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  cartContent: {
    padding: '20px',
  },
  cartItem: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#F8F8F8',
    borderRadius: '12px',
    marginBottom: '16px',
    position: 'relative',
  },
  productImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: 'white',
    flexShrink: 0,
  },
  productInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  productName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    lineHeight: '1.4',
  },
  productVariant: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    margin: '4px 0 0 0',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    border: '1px solid #E0E0E0',
    backgroundColor: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  qtyValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    minWidth: '20px',
    textAlign: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#999',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
  couponSection: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    marginBottom: '24px',
  },
  couponInput: {
    flex: 1,
    padding: '14px 16px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  applyBtn: {
    padding: '14px 24px',
    backgroundColor: '#E8E8E8',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  summarySection: {
    borderTop: '1px solid #E8E8E8',
    paddingTop: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#666',
  },
  summaryValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  discountValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4CAF50',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '2px solid #E8E8E8',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#333',
  },
  checkoutBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#2D5F4F',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '24px',
    transition: 'background-color 0.3s ease',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyCartIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyCartTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 12px 0',
  },
  emptyCartText: {
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
  },
  btnPrimary: {
    backgroundColor: '#2D5F4F',
    color: 'white',
  },
};

export default Cart;

