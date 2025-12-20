import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdArrowBack, MdLocalShipping, MdHome, MdCreditCard } from 'react-icons/md';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = () => {
    try {
      setLoading(true);

      // Load order from localStorage
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const foundOrder = mockOrders.find(o => o.order_id === id);

      if (foundOrder) {
        setOrder(foundOrder);
        console.log('✅ Order details loaded:', foundOrder);
      } else {
        console.log('❌ Order not found:', id);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: '#FEF3C7', textColor: '#92400E' },
      confirmed: { label: 'Confirmed', color: '#DBEAFE', textColor: '#1E40AF' },
      in_transit: { label: 'In Transit', color: '#E0E7FF', textColor: '#4338CA' },
      delivered: { label: 'Delivered', color: '#D1FAE5', textColor: '#065F46' },
      cancelled: { label: 'Cancelled', color: '#FEE2E2', textColor: '#991B1B' },
    };

    const config = statusConfig[status] || statusConfig.confirmed;
    return (
      <span style={{
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        backgroundColor: config.color,
        color: config.textColor,
      }}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={styles.loading}>Loading order details...</div>
    );
  }

  if (!order) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Order Not Found</h1>
          <p style={styles.text}>The order you're looking for doesn't exist.</p>
          <button style={styles.btn} onClick={() => navigate('/orders')}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/orders')}>
            <MdArrowBack />
          </button>
          <h1 style={styles.headerTitle}>Order Details</h1>
        </div>

        {/* Order Info Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.orderNumber}>Order #{order.order_id}</h2>
              <p style={styles.orderDate}>
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        {/* Shipping Address */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <MdHome style={{fontSize: '24px', color: '#FF6B35'}} />
            <h3 style={styles.sectionTitle}>Shipping Address</h3>
          </div>
          <div style={styles.addressInfo}>
            <p style={styles.addressName}>{order.address?.name}</p>
            <p style={styles.addressText}>{order.address?.address}</p>
            <p style={styles.addressText}>{order.address?.city}</p>
            <p style={styles.addressText}>{order.address?.phone}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <MdCreditCard style={{fontSize: '24px', color: '#FF6B35'}} />
            <h3 style={styles.sectionTitle}>Payment Method</h3>
          </div>
          <p style={styles.paymentText}>
            {order.payment?.type === 'cod' ? 'Cash on Delivery' :
             order.payment?.type === 'card-new' ? 'Credit/Debit Card' :
             order.payment?.type === 'upi-new' ? 'UPI' :
             order.payment?.type === 'payment-app' ? `${order.payment?.app}` :
             'Cash on Delivery'}
          </p>
        </div>

        {/* Order Items */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Order Items</h3>
          <div style={styles.itemsList}>
            {order.items?.map((item, index) => (
              <div key={index} style={styles.item}>
                <img
                  src={item.image || item.product?.image || 'https://via.placeholder.com/80'}
                  alt={item.name || item.product?.name}
                  style={styles.itemImage}
                />
                <div style={styles.itemDetails}>
                  <h4 style={styles.itemName}>{item.name || item.product?.name || 'Product'}</h4>
                  <p style={styles.itemQuantity}>Quantity: {item.quantity || 1}</p>
                </div>
                <span style={styles.itemPrice}>
                  ₹{Number(item.price || item.product?.price || 0).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{order.total ? Number(order.total).toLocaleString('en-IN') : '0'}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span>₹50</span>
          </div>
          <div style={{...styles.summaryRow, ...styles.totalRow}}>
            <span style={{fontWeight: '700'}}>Total</span>
            <span style={{fontWeight: '700', color: '#FF6B35'}}>
              ₹{order.total ? (Number(order.total) + 50).toLocaleString('en-IN') : '50'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <Link to={`/orders/${order.order_id}/track`} style={styles.trackBtn}>
            <MdLocalShipping style={{marginRight: '8px'}} />
            Track Order
          </Link>
          <button style={styles.backToOrdersBtn} onClick={() => navigate('/orders')}>
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F5F5DC',
    paddingTop: '80px',
    paddingBottom: '40px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px',
  },
  loading: {
    textAlign: 'center',
    padding: '100px 20px',
    fontSize: '18px',
    color: '#666',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  backBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#333',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1F2937',
    margin: '0 0 8px 0',
  },
  orderDate: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0,
  },
  addressInfo: {
    paddingLeft: '36px',
  },
  addressName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 8px 0',
  },
  addressText: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '4px 0',
  },
  paymentText: {
    fontSize: '16px',
    color: '#1F2937',
    paddingLeft: '36px',
    margin: 0,
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 8px 0',
  },
  itemQuantity: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#FF6B35',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    fontSize: '15px',
    color: '#4B5563',
    borderBottom: '1px solid #E5E7EB',
  },
  totalRow: {
    borderBottom: 'none',
    fontSize: '18px',
    paddingTop: '16px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  trackBtn: {
    flex: 1,
    padding: '14px 24px',
    backgroundColor: '#FF6B35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  backToOrdersBtn: {
    flex: 1,
    padding: '14px 24px',
    backgroundColor: 'white',
    color: '#FF6B35',
    border: '2px solid #FF6B35',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btn: {
    padding: '12px 24px',
    backgroundColor: '#FF6B35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '12px',
  },
  text: {
    fontSize: '16px',
    color: '#6B7280',
  },
};

export default OrderDetails;