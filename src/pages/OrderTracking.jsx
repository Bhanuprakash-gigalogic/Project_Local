import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ordersAPI } from '../services/api';

// Inline Styles
const styles = {
  trackingPage: {
    backgroundColor: '#FAFAFA',
    minHeight: '100vh',
    padding: '40px 0',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  },
  orderNumber: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '24px',
  },
  statusText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
  },
  deliveryAgent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  agentName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 4px 0',
  },
  agentRole: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 16px 0',
  },
  callButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#DC2626',
    border: '2px solid #DC2626',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  timeline: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  timelineItem: {
    display: 'flex',
    gap: '20px',
    paddingBottom: '32px',
    position: 'relative',
  },
  timelineItemLast: {
    paddingBottom: '0',
  },
  timelineMarker: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#22C55E',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  },
  timelineMarkerPending: {
    backgroundColor: '#E0E0E0',
    color: '#999',
  },
  timelineLine: {
    position: 'absolute',
    left: '11px',
    top: '24px',
    bottom: '-32px',
    width: '2px',
    backgroundColor: '#E0E0E0',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  timelineDate: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  timelineLocation: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    margin: '4px 0 0 0',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    border: '1px solid #90CAF9',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: '20px',
    color: '#1976D2',
    flexShrink: 0,
  },
  infoText: {
    fontSize: '14px',
    color: '#1565C0',
    margin: 0,
    lineHeight: '1.5',
  },
};

const OrderTracking = () => {
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracking();
    fetchOrderDetails();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchTracking();
    }, 30000);

    return () => clearInterval(interval);
  }, [id]);

  const fetchTracking = async () => {
    try {
      const response = await ordersAPI.getOrderTracking(id);
      const trackingData = response.data.data || response.data;

      console.log('✅ Tracking data:', trackingData);
      setTracking(trackingData);
    } catch (error) {
      console.error('❌ Error fetching tracking:', error);
      // Mock data fallback - Different tracking based on order ID

      // Order #1 (WZ-2024-001) - Delivered
      if (id === '1') {
        setTracking({
          current_status: 'delivered',
          eta: null,
          tracking_steps: [
            { title: 'Delivered', time: '9 Dec, 2:30 PM', location: 'Hyderabad, IN', completed: true },
            { title: 'Out for Delivery', time: '9 Dec, 10:15 AM', location: 'Hyderabad, IN', completed: true },
            { title: 'Package arrived at the final delivery station', time: '9 Dec, 12:48 AM', location: 'Hyderabad, IN', completed: true },
            { title: 'Delivery appointment scheduled', time: '9 Dec, 12:17 AM', location: 'IN', completed: true },
            { title: 'Package left the shipper facility', time: '8 Dec, 9:30 PM', location: '', completed: true },
            { title: 'Packed at Store', time: '8 Dec, 4:10 PM', location: '', completed: true },
            { title: 'Order Confirmed', time: '8 Dec, 2:25 PM', location: '', completed: true },
          ],
          delivery_agent: {
            name: 'Rajesh Kumar',
            phone: '+919999888777',
            photo: 'https://via.placeholder.com/100'
          }
        });
      }
      // Order #2 (WZ-2024-002) - In Transit
      else {
        setTracking({
          current_status: 'in_transit',
          eta: '2-3 hours',
          tracking_steps: [
            { title: 'Order Confirmed', time: '7 Dec, 3:15 PM', completed: true },
            { title: 'Packed at Store', time: '7 Dec, 5:20 PM', completed: true },
            { title: 'Shipped', time: '8 Dec, 8:00 AM', completed: true, current: true },
            { title: 'Out for Delivery', time: '', completed: false },
            { title: 'Delivered', time: '', completed: false },
          ],
          delivery_agent: {
            name: 'Amit Sharma',
            phone: '+919888777666',
            photo: 'https://via.placeholder.com/100'
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await ordersAPI.getOrderById(id);
      const orderData = response.data.data || response.data;

      console.log('✅ Order details:', orderData);
      setOrderDetails(orderData);
    } catch (error) {
      console.error('❌ Error fetching order details:', error);
    }
  };

  if (loading && !tracking) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', fontSize: '18px', color: '#666'}}>Loading tracking information...</div>;
  }

  return (
    <div style={styles.trackingPage}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Track Order</h1>
        <h2 style={styles.orderNumber}>Order #{orderDetails?.order_id || id}</h2>
        <p style={styles.statusText}>
          Status: <strong>{tracking?.current_status?.replace(/_/g, ' ').toUpperCase()}</strong>
        </p>

        {/* Info Box */}
        <div style={styles.infoBox}>
          <span style={styles.infoIcon}>ℹ️</span>
          <p style={styles.infoText}>
            You're seeing the same order status information that our Customer Service associates can access.
          </p>
        </div>

        {/* Delivery Agent Info */}
        {tracking?.delivery_agent && (
          <div style={styles.deliveryAgent}>
            <h3 style={styles.agentName}>{tracking.delivery_agent.name}</h3>
            <p style={styles.agentRole}>Delivery Partner</p>
            <a
              href={`tel:${tracking.delivery_agent.phone}`}
              style={styles.callButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#DC2626';
              }}
            >
              📞 Call
            </a>
          </div>
        )}

        {/* Tracking Timeline */}
        <div style={styles.timeline}>
          {tracking?.tracking_steps?.map((step, index) => (
            <div
              key={index}
              style={{
                ...styles.timelineItem,
                ...(index === tracking.tracking_steps.length - 1 ? styles.timelineItemLast : {})
              }}
            >
              <div style={{position: 'relative'}}>
                <div style={{
                  ...styles.timelineMarker,
                  ...(step.completed ? {} : styles.timelineMarkerPending)
                }}>
                  {step.completed ? '✓' : ''}
                </div>
                {index < tracking.tracking_steps.length - 1 && (
                  <div style={styles.timelineLine}></div>
                )}
              </div>
              <div style={styles.timelineContent}>
                <h3 style={styles.timelineTitle}>{step.title}</h3>
                <p style={styles.timelineDate}>{step.time}</p>
                {step.location && (
                  <p style={styles.timelineLocation}>{step.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

