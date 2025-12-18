import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Inline Styles
const styles = {
  ordersPage: {
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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '18px',
    color: '#666',
  },
  emptyOrders: {
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
    textDecoration: 'none',
    display: 'inline-block',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  orderHeader: {
    padding: '20px',
    borderBottom: '1px solid #E0E0E0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  orderInfo: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  orderInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  orderLabel: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  orderValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '600',
  },
  statusBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  statusConfirmed: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  statusTransit: {
    backgroundColor: '#E0E7FF',
    color: '#4338CA',
  },
  statusDelivered: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  orderItems: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  orderItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  itemQuantity: {
    fontSize: '14px',
    color: '#666',
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#8B4513',
    marginLeft: 'auto',
  },
  orderFooter: {
    padding: '20px',
    borderTop: '1px solid #E0E0E0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
  },
  viewDetailsBtn: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: '#8B4513',
    border: '2px solid #8B4513',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Load orders from localStorage (mock orders)
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');

      if (mockOrders.length > 0) {
        // Use actual orders from localStorage
        const formattedOrders = mockOrders.map((order, index) => ({
          id: order.order_id || index + 1,
          order_number: order.order_id || `WDZ-${Date.now()}`,
          date: order.created_at || new Date().toISOString(),
          status: order.status || 'confirmed',
          total: order.total || 0,
          items: order.items || [],
          address: order.address,
          payment: order.payment,
          delivery_method: order.delivery_method,
        }));

        setOrders(formattedOrders);
        console.log('✅ Loaded orders from localStorage:', formattedOrders);
      } else {
        // Fallback to demo data if no orders
        const demoOrders = [
          {
            id: 1,
            order_number: 'WZ-2024-001',
            date: '2024-12-08',
            status: 'delivered',
            total: 6350.00,
            items: [
              {
                name: 'Woven Accent Chair',
                quantity: 1,
                price: 4800.00,
                image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400'
              },
              {
                name: 'Handcrafted Bowls',
                quantity: 1,
                price: 1550.00,
                image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400'
              },
            ],
          },
        ];
        setOrders(demoOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', style: styles.statusPending },
      confirmed: { label: 'Confirmed', style: styles.statusConfirmed },
      in_transit: { label: 'In Transit', style: styles.statusTransit },
      delivered: { label: 'Delivered', style: styles.statusDelivered },
      cancelled: { label: 'Cancelled', style: styles.statusCancelled },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <span style={{...styles.statusBadge, ...config.style}}>{config.label}</span>;
  };

  if (loading) {
    return <div style={styles.loading}>Loading orders...</div>;
  }

  return (
    <div style={styles.ordersPage}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={styles.emptyOrders}>
            <div style={styles.emptyIcon}>📦</div>
            <h2 style={styles.emptyTitle}>No orders yet</h2>
            <p style={styles.emptyText}>Start shopping to see your orders here!</p>
            <Link
              to="/"
              style={styles.btn}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0522D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B4513'}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderInfo}>
                    <div style={styles.orderInfoItem}>
                      <span style={styles.orderLabel}>Order Number</span>
                      <span style={styles.orderValue}>#{order.order_number}</span>
                    </div>
                    <div style={styles.orderInfoItem}>
                      <span style={styles.orderLabel}>Order Date</span>
                      <span style={styles.orderValue}>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <div key={index} style={styles.orderItem}>
                      <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        style={styles.itemImage}
                      />
                      <div style={styles.itemDetails}>
                        <h4 style={styles.itemName}>{item.name}</h4>
                        <p style={styles.itemQuantity}>Quantity: {item.quantity}</p>
                      </div>
                      <span style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.orderFooter}>
                  <div style={styles.orderTotal}>
                    Total: <span style={{color: '#8B4513', marginLeft: '8px'}}>₹{order.total.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{display: 'flex', gap: '12px'}}>
                    <Link
                      to={`/orders/${order.id}`}
                      style={{...styles.viewDetailsBtn, backgroundColor: '#8B4513', color: 'white'}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#A0522D';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#8B4513';
                      }}
                    >
                      View Details
                    </Link>

                    <Link
                      to={`/orders/${order.id}/track`}
                      style={styles.viewDetailsBtn}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#8B4513';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#8B4513';
                      }}
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

