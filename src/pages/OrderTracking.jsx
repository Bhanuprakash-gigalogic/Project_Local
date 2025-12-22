import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ordersAPI } from '../services/api';

// Helper function to format date and time
const formatDateTime = (date) => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${day} ${month}, ${displayHours}:${displayMinutes} ${ampm}`;
};

// Inline Styles
const styles = {
  trackingPage: {
    backgroundColor: '#F5F0E8',
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

      // Mock data fallback - Load from localStorage
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const order = mockOrders.find(o => o.order_id === id);

      if (order) {
        // Generate realistic tracking timeline based on order creation time
        const orderDate = new Date(order.created_at || order.order_date);
        const now = new Date();

        // Format date and time helper
        const formatDateTime = (date) => {
          const d = new Date(date);
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const day = d.getDate();
          const month = months[d.getMonth()];
          const hours = d.getHours();
          const minutes = d.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
          return `${day} ${month}, ${displayHours}:${displayMinutes} ${ampm}`;
        };

        // Calculate time differences in hours
        const hoursSinceOrder = (now - orderDate) / (1000 * 60 * 60);

        // Calculate all stage times
        const packingTime = new Date(orderDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
        const shippedTime = new Date(orderDate.getTime() + (6 * 60 * 60 * 1000)); // 6 hours later
        const inTransitTime = new Date(orderDate.getTime() + (12 * 60 * 60 * 1000)); // 12 hours later
        const estimatedDelivery = new Date(order.estimated_delivery);
        const outForDeliveryTime = new Date(estimatedDelivery);
        outForDeliveryTime.setHours(10, 0, 0, 0); // 10:00 AM on delivery day
        const deliveredTime = new Date(outForDeliveryTime.getTime() + (4 * 60 * 60 * 1000)); // 4 hours after out for delivery

        // Build ALL 6 tracking steps (always show all stages)
        const trackingSteps = [
          // Step 1: Order Confirmed (always completed)
          {
            title: 'Order Confirmed',
            time: formatDateTime(orderDate),
            location: '',
            completed: true
          },
          // Step 2: Packing Completed
          {
            title: 'Packing Completed',
            time: hoursSinceOrder >= 2 ? formatDateTime(packingTime) : '',
            location: hoursSinceOrder >= 2 ? 'Seller Warehouse' : '',
            completed: hoursSinceOrder >= 2
          },
          // Step 3: Shipped
          {
            title: 'Shipped',
            time: hoursSinceOrder >= 6 ? formatDateTime(shippedTime) : '',
            location: hoursSinceOrder >= 6 ? 'In Transit' : '',
            completed: hoursSinceOrder >= 6
          },
          // Step 4: In Transit
          {
            title: 'In Transit',
            time: hoursSinceOrder >= 12 ? formatDateTime(inTransitTime) : '',
            location: hoursSinceOrder >= 12 ? 'On the way to delivery hub' : '',
            completed: hoursSinceOrder >= 12
          },
          // Step 5: Out for Delivery
          {
            title: 'Out for Delivery',
            time: now >= outForDeliveryTime ? formatDateTime(outForDeliveryTime) : '',
            location: now >= outForDeliveryTime ? (order.address?.city || 'Your City') : '',
            completed: now >= outForDeliveryTime
          },
          // Step 6: Delivered
          {
            title: 'Delivered',
            time: now >= deliveredTime ? formatDateTime(deliveredTime) : '',
            location: now >= deliveredTime ? (order.address?.city || 'Your City') : '',
            completed: now >= deliveredTime
          }
        ];

        // Determine current status
        let currentStatus = 'confirmed';
        if (trackingSteps.find(s => s.title === 'Delivered' && s.completed)) {
          currentStatus = 'delivered';
        } else if (trackingSteps.find(s => s.title === 'Out for Delivery' && s.completed)) {
          currentStatus = 'out_for_delivery';
        } else if (trackingSteps.find(s => s.title === 'In Transit' && s.completed)) {
          currentStatus = 'in_transit';
        } else if (trackingSteps.find(s => s.title === 'Shipped' && s.completed)) {
          currentStatus = 'shipped';
        } else if (trackingSteps.find(s => s.title === 'Packing Completed' && s.completed)) {
          currentStatus = 'packing';
        }

        setTracking({
          current_status: currentStatus,
          eta: currentStatus === 'delivered' ? null : formatDateTime(estimatedDelivery),
          tracking_steps: trackingSteps,
          delivery_agent: {
            name: 'Amit Sharma',
            phone: '+919888777666',
            photo: 'https://via.placeholder.com/100'
          }
        });
      } else {
        // Fallback for old orders or order ID not found
        setTracking({
          current_status: 'confirmed',
          eta: '5-7 business days',
          tracking_steps: [
            { title: 'Order Confirmed', time: formatDateTime(new Date()), completed: true },
            { title: 'Packing Completed', time: '', completed: false },
            { title: 'Shipped', time: '', completed: false },
            { title: 'In Transit', time: '', completed: false },
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

