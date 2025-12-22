// Mock Notifications Data
export const mockNotifications = [
  // Today
  {
    id: 'notif_001',
    type: 'offer',
    title: 'Flash Sale! 30% off electronics',
    message: 'Your weekly dose of deals, ready for you.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    icon: '🏷️',
    actionUrl: '/categories',
  },
  {
    id: 'notif_002',
    type: 'order',
    title: 'Your order #WZ12345 has shipped',
    message: 'Track your package to see its current location.',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    read: false,
    icon: '📦',
    actionUrl: '/orders/WZ12345',
  },
  
  // Yesterday
  {
    id: 'notif_003',
    type: 'security',
    title: 'Your password was updated',
    message: 'Your password was successfully updated from a new device.',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    read: true,
    icon: '🔒',
    actionUrl: null,
  },
  
  // October 15
  {
    id: 'notif_004',
    type: 'review',
    title: 'How was your recent purchase?',
    message: 'Leave a review for the "Wireless Noise-Cancelling Headphones".',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true,
    icon: '⭐',
    actionUrl: '/write-review',
  },
  {
    id: 'notif_005',
    type: 'offer',
    title: 'Exclusive Deal: Premium Furniture Sale',
    message: 'Get up to 40% off on premium teak furniture. Limited time offer!',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    read: true,
    icon: '🏷️',
    actionUrl: '/categories/living',
  },
  {
    id: 'notif_006',
    type: 'order',
    title: 'Your order #WZ12340 has been delivered',
    message: 'Hope you enjoy your purchase! Please rate your delivery experience.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    read: true,
    icon: '✅',
    actionUrl: '/orders/WZ12340',
  },
  {
    id: 'notif_007',
    type: 'security',
    title: 'New login from Chrome on Windows',
    message: 'We noticed a new login to your account. If this wasn\'t you, please secure your account.',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    read: true,
    icon: '🔐',
    actionUrl: null,
  },
];

// Group notifications by date
export const groupNotificationsByDate = (notifications) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const grouped = {
    today: [],
    yesterday: [],
    older: [],
  };

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.timestamp);
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

    if (notifDay.getTime() === today.getTime()) {
      grouped.today.push(notif);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      grouped.yesterday.push(notif);
    } else {
      grouped.older.push(notif);
    }
  });

  return grouped;
};

// Get time ago string
export const getTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get unread count
export const getUnreadCount = (notifications) => {
  return notifications.filter(n => !n.read).length;
};

