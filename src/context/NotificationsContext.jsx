import { createContext, useContext, useState, useEffect } from 'react';
import { notificationsAPI, safeAPICall } from '../services/api';
import { mockNotifications, getUnreadCount } from '../data/mockNotifications';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const result = await safeAPICall(
      () => notificationsAPI.getNotifications(),
      mockNotifications,
      'Fetch Notifications'
    );
    
    const notifData = result.data || [];
    setNotifications(notifData);
    setUnreadCount(getUnreadCount(notifData));
    setLoading(false);
  };

  const fetchUnreadCount = async () => {
    const result = await safeAPICall(
      () => notificationsAPI.getUnreadCount(),
      { count: getUnreadCount(notifications.length > 0 ? notifications : mockNotifications) },
      'Fetch Unread Count'
    );
    setUnreadCount(result.data.count || 0);
  };

  const markAsRead = async (notificationId) => {
    await safeAPICall(
      () => notificationsAPI.markAsRead(notificationId),
      { success: true },
      'Mark As Read'
    );

    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(getUnreadCount(updatedNotifications));
  };

  const markAllAsRead = async () => {
    await safeAPICall(
      () => notificationsAPI.markAllAsRead(),
      { success: true },
      'Mark All As Read'
    );

    const updatedNotifications = notifications.map(n => ({
      ...n,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

