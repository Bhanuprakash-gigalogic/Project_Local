import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdEdit, MdHome, MdCreditCard } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';

const ReviewOrder = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    // Load selected address and payment from localStorage
    const addressId = localStorage.getItem('selectedAddressId');
    const savedAddress = localStorage.getItem('selectedAddress');
    const paymentData = localStorage.getItem('selectedPayment');

    if (!addressId || !paymentData) {
      navigate('/checkout/address');
      return;
    }

    // Try to load from saved address object first
    if (savedAddress) {
      try {
        const selectedAddress = JSON.parse(savedAddress);
        setAddress({
          name: selectedAddress.name,
          address: `${selectedAddress.address_line1}${selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''}`,
          city: `${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.pincode}`,
          phone: selectedAddress.phone,
        });
        console.log('✅ Loaded selected address:', selectedAddress);
      } catch (e) {
        console.error('Error parsing saved address:', e);
      }
    } else {
      // Fallback: Load from mock addresses by ID
      const mockAddresses = JSON.parse(localStorage.getItem('mockAddresses') || '[]');
      const selectedAddress = mockAddresses.find(addr =>
        (addr.address_id || addr.id) === parseInt(addressId)
      );

      if (selectedAddress) {
        setAddress({
          name: selectedAddress.name,
          address: `${selectedAddress.address_line1}${selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''}`,
          city: `${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.pincode}`,
          phone: selectedAddress.phone,
        });
      } else {
        // Last fallback: Use default address
        const defaultAddr = mockAddresses.find(addr => addr.is_default) || mockAddresses[0];
        if (defaultAddr) {
          setAddress({
            name: defaultAddr.name,
            address: `${defaultAddr.address_line1}${defaultAddr.address_line2 ? ', ' + defaultAddr.address_line2 : ''}`,
            city: `${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.pincode}`,
            phone: defaultAddr.phone,
          });
        }
      }
    }

    setPayment(JSON.parse(paymentData));
  }, [navigate]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // ============================================
      // 🧪 MOCK MODE - Simulate order placement
      // ============================================
      const USE_MOCK_DATA = true; // Set to false to use real API

      const addressId = localStorage.getItem('selectedAddressId');
      const deliveryMethod = localStorage.getItem('deliveryMethod');

      const orderData = {
        cart_id: cart?.cart_id || 'cart_current',
        address_id: addressId,
        payment_method: payment?.type || 'cod',
        delivery_method: deliveryMethod || 'standard',
        notes: '',
      };

      let orderId;

      if (USE_MOCK_DATA) {
        // Mock order placement - simulate successful order
        console.log('🧪 Mock: Creating order with data:', orderData);

        // Generate mock order ID
        orderId = `ORD${Date.now()}`;

        // Save order to localStorage for order history
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        const newOrder = {
          order_id: orderId,
          ...orderData,
          items: cart?.items || cart || [],
          total: getCartTotal(),
          status: 'confirmed',
          created_at: new Date().toISOString(),
          address: address,
          payment: payment,
          delivery_method: deliveryMethod || 'standard',
        };
        mockOrders.push(newOrder);
        localStorage.setItem('mockOrders', JSON.stringify(mockOrders));

        console.log('🧪 Mock: Order created successfully:', orderId);
      } else {
        // Use real API
        let response;
        if (payment?.type === 'cod') {
          response = await ordersAPI.createOrder(orderData);
        } else {
          response = await ordersAPI.createOnlineOrder(orderData);
        }
        const responseData = response.data.data || response.data;
        orderId = responseData.order_id;
      }

      // Clear cart and navigate to success page
      clearCart();
      localStorage.removeItem('selectedAddressId');
      localStorage.removeItem('selectedAddress');
      localStorage.removeItem('selectedPayment');
      localStorage.removeItem('deliveryMethod');

      console.log('✅ Order placed successfully! Order ID:', orderId);
      navigate('/order-confirmed', { state: { orderId: orderId } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!address || !payment) {
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/checkout/payment')}>
            <MdArrowBack />
          </button>
          <h1 style={styles.headerTitle}>Review Your Order</h1>
        </div>

        {/* Progress Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tab}>
            <span style={styles.tabText}>Address</span>
          </div>
          <div style={styles.tab}>
            <span style={styles.tabText}>Payment</span>
          </div>
          <div style={{...styles.tab, ...styles.tabActive}}>
            <span style={{...styles.tabText, ...styles.tabTextActive}}>Review</span>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Ship To Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Ship To</h2>
              <button style={styles.editBtn} onClick={() => navigate('/checkout/address')}>
                <MdEdit style={{marginRight: '4px'}} />
                Edit
              </button>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.iconCircle}>
                <MdHome style={{fontSize: '20px', color: '#FF6B35'}} />
              </div>
              <div style={styles.infoContent}>
                <h3 style={styles.infoName}>{address.name}</h3>
                <p style={styles.infoText}>{address.address}</p>
                <p style={styles.infoText}>{address.city}</p>
                <p style={styles.infoText}>{address.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Payment Method</h2>
              <button style={styles.editBtn} onClick={() => navigate('/checkout/payment')}>
                <MdEdit style={{marginRight: '4px'}} />
                Edit
              </button>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.iconCircle}>
                <MdCreditCard style={{fontSize: '20px', color: '#FF6B35'}} />
              </div>
              <div style={styles.infoContent}>
                <h3 style={styles.infoName}>
                  {payment.type === 'card' ? `Visa •••• ${payment.last4}` : 
                   payment.type === 'upi' ? 'UPI Payment' : 
                   'Cash on Delivery'}
                </h3>
                {payment.type === 'card' && (
                  <p style={styles.infoText}>Expires {payment.expiry}</p>
                )}
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Items ({cart.length})</h2>
            {cart.map((item) => (
              <div key={item.product.product_id || item.product.id} style={styles.itemCard}>
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  style={styles.itemImage}
                />
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.product.name}</h3>
                  <p style={styles.itemQty}>Qty: {item.quantity}</p>
                </div>
                <div style={styles.itemPrice}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Order Totals</h2>
            <div style={styles.totalsCard}>
              <div style={styles.totalRow}>
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Shipping</span>
                <span>$5.00</span>
              </div>
              <div style={styles.totalRow}>
                <span>Taxes</span>
                <span>$2.40</span>
              </div>
              <div style={{...styles.totalRow, ...styles.totalRowFinal}}>
                <span>Total</span>
                <span>${(getCartTotal() + 5 + 2.40).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div style={styles.termsContainer}>
            <p style={styles.termsText}>
              By placing your order, you agree to our <a href="/terms" style={styles.termsLink}>Terms of Service</a>
            </p>
          </div>

          {/* Place Order Button */}
          <button
            style={styles.placeOrderBtn}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
    paddingBottom: '40px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #E0E0E0',
    backgroundColor: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    color: '#333',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  tabsContainer: {
    display: 'flex',
    borderBottom: '1px solid #E0E0E0',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    padding: '16px',
    textAlign: 'center',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
  },
  tabActive: {
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#999',
  },
  tabTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  content: {
    padding: '20px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#FF6B35',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
  },
  infoCard: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
  },
  iconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#FFF5F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  infoText: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 4px 0',
    lineHeight: '1.5',
  },
  itemCard: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
    marginBottom: '12px',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  itemQty: {
    fontSize: '12px',
    color: '#666',
    margin: 0,
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    alignSelf: 'center',
  },
  totalsCard: {
    padding: '16px',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#666',
  },
  totalRowFinal: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    paddingTop: '12px',
    borderTop: '1px solid #E0E0E0',
    marginTop: '8px',
  },
  termsContainer: {
    padding: '16px',
    backgroundColor: '#F9F9F9',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  termsText: {
    fontSize: '12px',
    color: '#666',
    margin: 0,
    textAlign: 'center',
  },
  termsLink: {
    color: '#FF6B35',
    textDecoration: 'none',
  },
  placeOrderBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#FF6B35',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default ReviewOrder;

