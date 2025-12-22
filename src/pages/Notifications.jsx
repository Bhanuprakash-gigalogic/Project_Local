import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationsContext';
import {
  groupNotificationsByDate,
  getTimeAgo
} from '../data/mockNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const [groupedNotifications, setGroupedNotifications] = useState({
    today: [],
    yesterday: [],
    older: [],
  });

  useEffect(() => {
    setGroupedNotifications(groupNotificationsByDate(notifications));
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      offer: '🏷️',
      order: '📦',
      security: '🔒',
      review: '⭐',
    };
    return icons[type] || '🔔';
  };

  const renderNotificationGroup = (title, notificationsList) => {
    if (notificationsList.length === 0) return null;

    return (
      <div style={styles.section} key={title}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        {notificationsList.map(notification => (
          <div
            key={notification.id}
            style={{
              ...styles.notificationCard,
              backgroundColor: notification.read ? '#FFFFFF' : '#FFF8F0',
            }}
            onClick={() => handleNotificationClick(notification)}
          >
            <div style={styles.notificationIcon}>
              {getNotificationIcon(notification.type)}
            </div>

            <div style={styles.notificationContent}>
              <div style={styles.notificationHeader}>
                <h4 style={styles.notificationTitle}>
                  {notification.title}
                </h4>
                <span style={styles.notificationTime}>
                  {getTimeAgo(notification.timestamp)}
                </span>
              </div>
              <p style={styles.notificationMessage}>
                {notification.message}
              </p>
            </div>

            {!notification.read && <div style={styles.unreadDot} />}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button
            style={styles.backBtn}
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <h1 style={styles.pageTitle}>Notifications</h1>

          <button
            style={styles.markAllBtn}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        </div>

        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔔</div>
            <h3 style={styles.emptyTitle}>No notifications yet</h3>
            <p style={styles.emptyMessage}>
              We'll notify you when something arrives
            </p>
          </div>
        ) : (
          <>
            {renderNotificationGroup('Today', groupedNotifications.today)}
            {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
            {renderNotificationGroup('Older', groupedNotifications.older)}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F0E8',
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
    justifyContent: 'space-between',
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
    fontSize: '35px',
    cursor: 'pointer',
    padding: '8px',
    color: '#333',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    flex: 1,
    textAlign: 'center',
  },
  markAllBtn: {
    background: 'none',
    border: 'none',
    color: '#FF6B35',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    padding: '16px 20px 8px',
    margin: 0,
  },
  notificationCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid #F0F0F0',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  notificationIcon: {
    fontSize: '24px',
    flexShrink: 0,
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F0',
    borderRadius: '50%',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px',
  },
  notificationTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    flex: 1,
  },
  notificationTime: {
    fontSize: '12px',
    color: '#999',
    flexShrink: 0,
    marginLeft: '8px',
  },
  notificationMessage: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    lineHeight: '1.4',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#FF6B35',
    borderRadius: '50%',
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '16px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  emptyMessage: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
};

export default Notifications;
