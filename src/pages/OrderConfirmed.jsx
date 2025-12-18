import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdCheckCircle, MdContentCopy, MdLocalShipping } from 'react-icons/md';

const OrderConfirmed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState({ start: '', end: '' });

  useEffect(() => {
    const id = location.state?.orderId || `WDZ${Date.now()}`;
    setOrderId(id);

    // Calculate estimated delivery based on delivery method
    const deliveryMethod = localStorage.getItem('deliveryMethod') || 'standard';
    const today = new Date();

    let startDays, endDays;

    if (deliveryMethod === 'express') {
      // Express: 1-2 business days
      startDays = 1;
      endDays = 2;
    } else {
      // Standard: 5-7 business days
      startDays = 5;
      endDays = 7;
    }

    // Calculate delivery dates (skip weekends)
    const getBusinessDate = (daysToAdd) => {
      let date = new Date(today);
      let addedDays = 0;

      while (addedDays < daysToAdd) {
        date.setDate(date.getDate() + 1);
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          addedDays++;
        }
      }

      return date;
    };

    const startDate = getBusinessDate(startDays);
    const endDate = getBusinessDate(endDays);

    const formatDate = (date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };

    setEstimatedDelivery({
      start: formatDate(startDate),
      end: formatDate(endDate)
    });
  }, [location]);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Success Icon */}
        <div style={styles.successIcon}>
          <div style={styles.checkCircle}>
            <MdCheckCircle style={{fontSize: '80px', color: '#4CAF50'}} />
          </div>
        </div>

        {/* Success Message */}
        <h1 style={styles.title}>Thank You for Your Order!</h1>
        <p style={styles.subtitle}>We've sent a confirmation to your email</p>

        {/* Order ID */}
        <div style={styles.orderIdCard}>
          <div style={styles.orderIdLabel}>Order ID</div>
          <div style={styles.orderIdRow}>
            <span style={styles.orderIdText}>#{orderId}</span>
            <button style={styles.copyBtn} onClick={handleCopyOrderId}>
              <MdContentCopy style={{fontSize: '18px'}} />
              {copied && <span style={styles.copiedText}>Copied!</span>}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div style={styles.summaryCard}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>3 Items</span>
            <span>₹4,250</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span>₹50</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax</span>
            <span>₹765</span>
          </div>
          <div style={{...styles.summaryRow, ...styles.summaryTotal}}>
            <span>Total</span>
            <span>₹5,065</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={styles.deliveryCard}>
          <div style={styles.deliveryIcon}>
            <MdLocalShipping style={{fontSize: '24px', color: '#FF6B35'}} />
          </div>
          <div style={styles.deliveryInfo}>
            <h3 style={styles.deliveryTitle}>Estimated Delivery</h3>
            <p style={styles.deliveryDate}>{estimatedDelivery.start} - {estimatedDelivery.end}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button style={styles.primaryBtn} onClick={() => navigate('/orders')}>
            Track Order
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>

        {/* View Order Details Link */}
        <button style={styles.linkBtn} onClick={() => navigate(`/orders/${orderId}`)}>
          View order details →
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  container: {
    maxWidth: '500px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px 24px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  successIcon: {
    marginBottom: '24px',
  },
  checkCircle: {
    display: 'inline-flex',
    padding: '20px',
    backgroundColor: '#E8F5E9',
    borderRadius: '50%',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 32px 0',
  },
  orderIdCard: {
    padding: '16px',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  orderIdLabel: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  orderIdRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  orderIdText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    color: '#FF6B35',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    position: 'relative',
  },
  copiedText: {
    fontSize: '12px',
    color: '#4CAF50',
    position: 'absolute',
    top: '-20px',
    right: 0,
    whiteSpace: 'nowrap',
  },
  summaryCard: {
    padding: '20px',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 16px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#666',
  },
  summaryTotal: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    paddingTop: '12px',
    borderTop: '1px solid #E0E0E0',
    marginTop: '8px',
  },
  deliveryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FFF5F0',
    borderRadius: '12px',
    marginBottom: '32px',
  },
  deliveryIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  deliveryInfo: {
    flex: 1,
    textAlign: 'left',
  },
  deliveryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  deliveryDate: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  primaryBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#FF6B35',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  secondaryBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'white',
    color: '#FF6B35',
    border: '2px solid #FF6B35',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#FF6B35',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
};

export default OrderConfirmed;

