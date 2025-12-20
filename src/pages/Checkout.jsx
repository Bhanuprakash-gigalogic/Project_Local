import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI, checkoutAPI, addressAPI, productsAPI } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { mockProducts } from '../data/mockData';

// Inline Styles
const styles = {
  checkoutPage: {
    backgroundColor: '#F5F5DC',
    minHeight: '100vh',
    padding: '20px 0',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '400',
    color: '#0F1111',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #DDD',
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '20px',
    alignItems: 'start',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #888C8C',
    borderRadius: '4px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #888C8C',
    borderRadius: '4px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  paymentOptionSelected: {
    borderColor: '#C45500',
    backgroundColor: '#FFF8F0',
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  paymentLabel: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#0F1111',
    cursor: 'pointer',
  },
  placeOrderBtn: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#FFD814',
    color: '#0F1111',
    border: '1px solid #FCD200',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '20px',
  },
  sidebar: {
    position: 'sticky',
    top: '20px',
  },
  summaryCard: {
    backgroundColor: 'white',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    padding: '20px',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '16px',
  },
  summaryItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E7E7E7',
  },
  summaryItemLast: {
    borderBottom: 'none',
    marginBottom: '0',
    paddingBottom: '0',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: '4px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#0F1111',
    margin: '0 0 4px 0',
    lineHeight: '1.4',
  },
  itemQty: {
    fontSize: '12px',
    color: '#565959',
    margin: 0,
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F1111',
    margin: 0,
    whiteSpace: 'nowrap',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#E7E7E7',
    margin: '16px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#0F1111',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    fontWeight: '700',
    color: '#B12704',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #E7E7E7',
  },
  addressList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  addressCard: {
    padding: '16px',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  addressCardSelected: {
    borderColor: '#C45500',
    backgroundColor: '#FFF8F0',
    borderWidth: '2px',
  },
  addressName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F1111',
    margin: '0 0 4px 0',
  },
  addressText: {
    fontSize: '14px',
    color: '#565959',
    margin: '0 0 4px 0',
    lineHeight: '1.4',
  },
  addNewAddressBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'white',
    color: '#0F1111',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '12px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px',
  },
  quantityBtn: {
    width: '24px',
    height: '24px',
    border: '1px solid #D5D9D9',
    borderRadius: '4px',
    backgroundColor: '#F0F2F2',
    color: '#0F1111',
    fontSize: '16px',
    fontWeight: '400',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    padding: 0,
  },
  quantityDisplay: {
    fontSize: '12px',
    color: '#0F1111',
    fontWeight: '400',
    minWidth: '30px',
    textAlign: 'center',
  },
  paymentIcon: {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    marginRight: '8px',
  },
  paymentMethodDetails: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#F7F8F8',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
  },
  upiInput: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #888C8C',
    borderRadius: '4px',
    outline: 'none',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  qrCodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #D5D9D9',
  },
  qrCodeTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F1111',
    marginBottom: '12px',
  },
  qrCodeSubtitle: {
    fontSize: '12px',
    color: '#565959',
    marginTop: '12px',
    textAlign: 'center',
  },
  paymentAppButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '12px',
  },
  paymentAppBtn: {
    padding: '12px',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { cart, getCartTotal, clearCart, updateQuantity } = useCart();

  // Checkout mode: 'cart' or 'buynow'
  const checkoutMode = searchParams.get('mode') || 'cart';
  const productIdFromUrl = searchParams.get('productId');
  const quantityFromUrl = parseInt(searchParams.get('quantity') || '1', 10);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showUpiQR, setShowUpiQR] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Items to checkout (either from cart or single product for Buy Now)
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [buyNowProduct, setBuyNowProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  // Initialize checkout items based on mode
  useEffect(() => {
    const initializeCheckout = async () => {
      if (checkoutMode === 'buynow' && productIdFromUrl) {
        // Buy Now mode - fetch single product
        await fetchBuyNowProduct(productIdFromUrl, quantityFromUrl);
      } else {
        // Cart mode - use cart items
        setCheckoutItems(cart);
      }
    };

    initializeCheckout();
  }, [checkoutMode, productIdFromUrl, quantityFromUrl, cart]);

  // Fetch saved addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Fetch checkout summary when address is selected
  useEffect(() => {
    if (selectedAddressId && cart?.cart_id) {
      fetchCheckoutSummary();
    }
  }, [selectedAddressId, cart]);

  // Fetch product details for Buy Now mode
  const fetchBuyNowProduct = async (productId, quantity) => {
    try {
      setLoading(true);

      // Try to fetch from API
      try {
        const response = await productsAPI.getProductById(productId);
        const productData = response.data.data || response.data;

        setBuyNowProduct(productData);

        // Create checkout item structure similar to cart
        const checkoutItem = {
          product_id: productData.product_id || productData.id,
          product: productData,
          quantity: quantity,
          price: productData.price,
          total: productData.price * quantity,
        };

        setCheckoutItems([checkoutItem]);
        console.log('✅ Buy Now product loaded from API:', productData.name);
        return;
      } catch (apiError) {
        console.log('⚠️ API unavailable, trying sessionStorage...');
      }

      // Try to get from sessionStorage (set by ProductDetails page)
      const sessionProduct = sessionStorage.getItem('buyNowProduct');
      if (sessionProduct) {
        try {
          const productData = JSON.parse(sessionProduct);

          setBuyNowProduct(productData);

          const checkoutItem = {
            product_id: productData.product_id || productData.id,
            product: productData,
            quantity: quantity,
            price: productData.price,
            total: productData.price * quantity,
          };

          setCheckoutItems([checkoutItem]);
          console.log('✅ Buy Now product loaded from sessionStorage:', productData.name);

          // Clear sessionStorage after use
          sessionStorage.removeItem('buyNowProduct');
          return;
        } catch (parseError) {
          console.log('⚠️ Failed to parse sessionStorage data');
        }
      }

      // Fallback to mock product data - search in centralized database
      let mockProduct = null;

      // Search through all mock products
      Object.keys(mockProducts).forEach(subcatId => {
        const products = mockProducts[subcatId];
        const match = products.find(p => p.id === parseInt(productId));
        if (match) {
          mockProduct = {
            product_id: match.id,
            id: match.id,
            name: match.name,
            price: match.price,
            mrp: match.mrp,
            image: match.image,
            description: match.description,
            category: match.category,
            seller: {
              seller_id: match.seller_id,
              name: match.seller_name,
            },
            in_stock: match.in_stock,
            rating: match.rating,
          };
        }
      });

      // If not found in mock database, use default product
      if (!mockProduct) {
        mockProduct = {
          product_id: productId,
          id: productId,
          name: 'Teak Wood King Size Bed',
          price: 45999,
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',
          description: 'Premium quality teak wood bed with elegant design',
          category: 'Bedroom',
          seller: {
            seller_id: 'seller_001',
            name: 'Premium Wood Furniture',
          },
          in_stock: true,
          rating: 4.5,
        };
      }

      setBuyNowProduct(mockProduct);

      // Create checkout item structure
      const checkoutItem = {
        product_id: mockProduct.product_id,
        product: mockProduct,
        quantity: quantity,
        price: mockProduct.price,
        total: mockProduct.price * quantity,
      };

      setCheckoutItems([checkoutItem]);
      console.log('✅ Buy Now product loaded from mock data:', mockProduct.name);

    } catch (error) {
      console.error('❌ Error in Buy Now checkout:', error);
      alert('Failed to load product. Redirecting to home...');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await addressAPI.getAddresses();
      const addressData = response.data.data || response.data;
      const addressList = Array.isArray(addressData) ? addressData : addressData.addresses || [];

      setAddresses(addressList);

      // Auto-select default address
      const defaultAddr = addressList.find(addr => addr.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.address_id || defaultAddr.id);
      } else if (addressList.length > 0) {
        setSelectedAddressId(addressList[0].address_id || addressList[0].id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchCheckoutSummary = async () => {
    try {
      const cartId = cart?.cart_id || 'cart_current';
      const response = await checkoutAPI.getCheckoutSummary(cartId, selectedAddressId);
      const summaryData = response.data.data || response.data;

      setCheckoutSummary(summaryData);
      console.log('✅ Checkout summary:', summaryData);
    } catch (error) {
      console.error('Error fetching checkout summary:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate total for checkout items
  const calculateTotal = () => {
    return checkoutItems.reduce((total, item) => {
      const product = item.product || item;
      const price = product.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Validate form data
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate checkout items
    if (checkoutItems.length === 0) {
      alert('No items to checkout');
      return;
    }

    setLoading(true);

    try {
      let addressId = selectedAddressId;

      // If no address is selected, create a new one from form data
      if (!addressId) {
        try {
          const newAddressData = {
            name: formData.name,
            phone: formData.phone,
            address_line1: formData.address,
            city: formData.city,
            state: 'Karnataka', // Default state
            pincode: formData.zipCode,
            is_default: addresses.length === 0, // Make it default if it's the first address
          };

          const addressResponse = await addressAPI.addAddress(newAddressData);
          const createdAddress = addressResponse.data.data || addressResponse.data;
          addressId = createdAddress.address_id || createdAddress.id;

          console.log('✅ New address created:', createdAddress);
        } catch (addressError) {
          console.error('❌ Error creating address:', addressError);
          // Continue without address ID - backend might handle it
        }
      }

      // Prepare order data based on checkout mode
      let orderData;

      if (checkoutMode === 'buynow') {
        // Buy Now mode - create order with single product
        orderData = {
          items: checkoutItems.map(item => ({
            product_id: item.product_id || item.product?.product_id || item.product?.id,
            quantity: item.quantity,
            price: item.price || item.product?.price,
          })),
          address_id: addressId,
          payment_method: paymentMethod,
          notes: formData.notes || '',
          coupons: [],
          contact_info: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
          }
        };
      } else {
        // Cart mode - use cart_id
        const cartId = cart?.cart_id || 'cart_current';
        orderData = {
          cart_id: cartId,
          address_id: addressId,
          payment_method: paymentMethod,
          notes: formData.notes || '',
          coupons: [],
          contact_info: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
          }
        };
      }

      let response;

      // Handle different payment methods
      if (paymentMethod === 'razorpay' || paymentMethod === 'card' || paymentMethod === 'upi') {
        // Create Razorpay order for online payments
        response = await ordersAPI.createOnlineOrder(orderData);
        const responseData = response.data.data || response.data;

        console.log('✅ Razorpay order created:', responseData);

        // Initialize Razorpay payment
        await initiateRazorpayPayment(responseData);

      } else if (paymentMethod === 'cod') {
        // Create COD order
        response = await ordersAPI.createOrder(orderData);
        const responseData = response.data.data || response.data;

        console.log('✅ COD order created:', responseData);

        // Clear cart only if in cart mode
        if (checkoutMode === 'cart') {
          clearCart();
        }

        alert(`Order placed successfully! Order ID: ${responseData.order_id}`);
        navigate(`/orders/${responseData.order_id}`);
      }

    } catch (error) {
      console.error('❌ Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = async (razorpayData) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    const options = {
      key: razorpayData.razorpay_key,
      amount: razorpayData.amount,
      currency: razorpayData.currency || 'INR',
      order_id: razorpayData.razorpay_order_id,
      ...razorpayData.payload_for_sdk,
      handler: async (response) => {
        // Payment successful - verify with backend
        await verifyPayment(razorpayData.order_id, response);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
          alert('Payment cancelled. You can retry from the orders page.');
          navigate('/orders');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (orderId, razorpayResponse) => {
    try {
      setLoading(true);

      const verificationData = {
        order_id: orderId,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      };

      const response = await ordersAPI.verifyRazorpayPayment(verificationData);
      const responseData = response.data.data || response.data;

      console.log('✅ Payment verified:', responseData);

      if (responseData.payment_status === 'paid') {
        // Clear cart only if in cart mode
        if (checkoutMode === 'cart') {
          clearCart();
        }
        alert('Payment successful! Order confirmed.');
        navigate(`/orders/${orderId}`);
      } else {
        alert('Payment verification failed. Please contact support.');
        navigate('/orders');
      }

    } catch (error) {
      console.error('❌ Payment verification failed:', error);
      alert('Payment verification failed. Please check your orders page.');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if no items to checkout
  if (checkoutItems.length === 0 && !loading) {
    if (checkoutMode === 'buynow') {
      // Buy Now mode but no product loaded - redirect to home
      navigate('/');
      return null;
    } else {
      // Cart mode but cart is empty - redirect to cart
      navigate('/cart');
      return null;
    }
  }

  return (
    <div style={styles.checkoutPage}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>
          {checkoutMode === 'buynow' ? 'Buy Now - Checkout' : 'Checkout'}
        </h1>

        {/* Mode Indicator */}
        {checkoutMode === 'buynow' && (
          <div style={{
            backgroundColor: '#FFF8F0',
            border: '1px solid #FFA41C',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '16px' }}>⚡</span>
            <span style={{ fontSize: '14px', color: '#0F1111' }}>
              <strong>Express Checkout:</strong> You're purchasing {checkoutItems.length} item{checkoutItems.length > 1 ? 's' : ''} directly
            </span>
          </div>
        )}

        <div style={styles.checkoutGrid}>
          {/* Main Content */}
          <div style={styles.mainContent}>
            {/* Contact Information */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>1. Contact Information</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#E77600'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#888C8C'}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#E77600'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#888C8C'}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#E77600'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#888C8C'}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>2. Shipping Address</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Street Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={styles.textarea}
                  rows="3"
                  onFocus={(e) => e.currentTarget.style.borderColor = '#E77600'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#888C8C'}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#E77600'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#888C8C'}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#E77600'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#888C8C'}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>3. Payment Method</h2>

              <div style={styles.paymentOptions}>
                {/* Cash on Delivery */}
                <label
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'cod' ? styles.paymentOptionSelected : {})
                  }}
                  onClick={() => {
                    setPaymentMethod('cod');
                    setShowUpiQR(false);
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  <span style={styles.paymentLabel}>💵 Cash on Delivery</span>
                </label>

                {/* Credit or Debit Card */}
                <label
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'card' ? styles.paymentOptionSelected : {})
                  }}
                  onClick={() => {
                    setPaymentMethod('card');
                    setShowUpiQR(false);
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  <span style={styles.paymentLabel}>💳 Credit or Debit Card</span>
                </label>

                {/* UPI Payment */}
                <label
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'upi' ? styles.paymentOptionSelected : {})
                  }}
                  onClick={() => {
                    setPaymentMethod('upi');
                    setShowUpiQR(false);
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  <span style={styles.paymentLabel}>📱 UPI (Google Pay, PhonePe, Paytm)</span>
                </label>

                {/* Razorpay */}
                <label
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'razorpay' ? styles.paymentOptionSelected : {})
                  }}
                  onClick={() => {
                    setPaymentMethod('razorpay');
                    setShowUpiQR(false);
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  <span style={styles.paymentLabel}>🔐 Razorpay (All Payment Methods)</span>
                </label>
              </div>

              {/* UPI Payment Details */}
              {paymentMethod === 'upi' && (
                <div style={styles.paymentMethodDetails}>
                  <h3 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
                    Pay using UPI
                  </h3>

                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., yourname@paytm)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={styles.upiInput}
                  />

                  <button
                    type="button"
                    onClick={() => setShowUpiQR(true)}
                    style={{
                      ...styles.paymentAppBtn,
                      width: '100%',
                      marginBottom: '12px',
                      backgroundColor: '#FFD814',
                      border: '1px solid #FCD200',
                    }}
                  >
                    Generate QR Code
                  </button>

                  {showUpiQR && (
                    <div style={styles.qrCodeContainer}>
                      <h4 style={styles.qrCodeTitle}>Scan QR Code to Pay</h4>
                      <QRCodeSVG
                        value={`upi://pay?pa=${upiId || 'merchant@upi'}&pn=Woodzon&am=${calculateTotal()}&cu=INR&tn=Order Payment`}
                        size={200}
                        level="H"
                        marginSize={2}
                      />
                      <p style={styles.qrCodeSubtitle}>
                        Scan with any UPI app to pay ₹{calculateTotal().toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div style={styles.paymentAppButtons}>
                    <button
                      type="button"
                      style={styles.paymentAppBtn}
                      onClick={() => {
                        window.open(`upi://pay?pa=merchant@paytm&pn=Woodzon&am=${getCartTotal()}&cu=INR`, '_blank');
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <span style={{fontSize: '20px'}}>🟢</span> Google Pay
                    </button>
                    <button
                      type="button"
                      style={styles.paymentAppBtn}
                      onClick={() => {
                        window.open(`phonepe://pay?pa=merchant@ybl&pn=Woodzon&am=${getCartTotal()}&cu=INR`, '_blank');
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <span style={{fontSize: '20px'}}>🟣</span> PhonePe
                    </button>
                  </div>
                </div>
              )}

              {/* Card Payment Details */}
              {paymentMethod === 'card' && (
                <div style={styles.paymentMethodDetails}>
                  <p style={{fontSize: '14px', color: '#565959', marginBottom: '8px'}}>
                    💳 You will be redirected to a secure payment gateway to enter your card details.
                  </p>
                  <p style={{fontSize: '12px', color: '#067D62'}}>
                    ✓ Supports Visa, Mastercard, Rupay, and American Express
                  </p>
                </div>
              )}

              {/* Razorpay Details */}
              {paymentMethod === 'razorpay' && (
                <div style={styles.paymentMethodDetails}>
                  <p style={{fontSize: '14px', color: '#565959', marginBottom: '8px'}}>
                    🔐 Razorpay supports multiple payment methods:
                  </p>
                  <ul style={{fontSize: '12px', color: '#0F1111', paddingLeft: '20px', margin: '8px 0'}}>
                    <li>Credit/Debit Cards</li>
                    <li>Net Banking</li>
                    <li>UPI (Google Pay, PhonePe, Paytm)</li>
                    <li>Wallets (Paytm, PhonePe, Amazon Pay)</li>
                    <li>EMI Options</li>
                  </ul>
                  <p style={{fontSize: '12px', color: '#067D62'}}>
                    ✓ Secure and encrypted payment processing
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.summaryCard}>
              <button
                type="button"
                style={styles.placeOrderBtn}
                onClick={handleSubmit}
                disabled={loading}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7CA00'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD814'}
              >
                {loading ? 'Placing Order...' : 'Place your order'}
              </button>

              <div style={styles.summaryDivider}></div>

              <h3 style={styles.summaryTitle}>Order Summary</h3>

              <div style={styles.summaryRow}>
                <span>Items ({checkoutItems.length}):</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Delivery:</span>
                <span style={{color: '#067D62', fontWeight: '700'}}>FREE</span>
              </div>

              <div style={styles.summaryTotal}>
                <span>Order Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <div style={styles.summaryDivider}></div>

              {/* Checkout Items */}
              {checkoutItems.map((item, index) => {
                const product = item.product || item;
                const productId = product.product_id || product.id;
                const productName = product.name || product.product_name || 'Product';
                const productImage = product.image || product.image_url || 'https://via.placeholder.com/80';
                const productPrice = product.price || 0;

                return (
                  <div
                    key={`${productId}-${index}`}
                    style={{
                      ...styles.summaryItem,
                      ...(index === checkoutItems.length - 1 ? styles.summaryItemLast : {})
                    }}
                  >
                    <img src={productImage} alt={productName} style={styles.itemImage} />
                    <div style={styles.itemDetails}>
                      <p style={styles.itemName}>{productName}</p>
                      {checkoutMode === 'cart' ? (
                        <div style={styles.quantityControls}>
                          <button
                            style={styles.quantityBtn}
                            onClick={() => updateQuantity(productId, item.quantity - 1)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E3E6E6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0F2F2'}
                          >
                            −
                          </button>
                          <span style={styles.quantityDisplay}>Qty: {item.quantity}</span>
                          <button
                            style={styles.quantityBtn}
                            onClick={() => updateQuantity(productId, item.quantity + 1)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E3E6E6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0F2F2'}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <p style={styles.itemQty}>Qty: {item.quantity}</p>
                      )}
                    </div>
                    <p style={styles.itemPrice}>
                      ₹{(productPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

