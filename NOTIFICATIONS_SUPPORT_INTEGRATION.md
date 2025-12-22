# Notifications & Help Support Module - Integration Guide

## Overview
This document provides complete integration details for the Notifications and Help & Support modules added to the Woodzon e-commerce application.

---

## 📁 Files Created

### Pages
1. `src/pages/Notifications.jsx` - Notifications list page
2. `src/pages/HelpSupport.jsx` - Help & Support main page
3. `src/pages/SupportTickets.jsx` - Support tickets list page
4. `src/pages/TicketDetail.jsx` - Individual ticket detail page
5. `src/pages/CreateTicket.jsx` - Create new support ticket page

### Data
1. `src/data/mockNotifications.js` - Mock notification data and helper functions
2. `src/data/mockSupport.js` - Mock support data (FAQs, tickets, contact info)

### API Updates
1. `src/services/api.js` - Added `notificationsAPI` and `supportAPI` endpoints

### Component Updates
1. `src/components/Header.jsx` - Added notification bell and help icons with badge
2. `src/App.jsx` - Added routes for all new pages

---

## 🗄️ Database Schema

### 1. Notifications Table

```sql
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type ENUM('offer', 'order', 'security', 'review', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    icon VARCHAR(10),
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_read (read),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2. Support Tickets Table

```sql
CREATE TABLE support_tickets (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('Product Issue', 'Delivery', 'Refund', 'Payment', 'Account', 'Technical', 'Other') NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('open', 'pending', 'resolved', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Ticket Messages Table

```sql
CREATE TABLE ticket_messages (
    id VARCHAR(50) PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL,
    sender_type ENUM('customer', 'support') NOT NULL,
    sender_id VARCHAR(50),
    sender_name VARCHAR(100),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
);
```

### 4. FAQs Table

```sql
CREATE TABLE faqs (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
);
```

### 5. Notification Settings Table

```sql
CREATE TABLE notification_settings (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    order_updates BOOLEAN DEFAULT TRUE,
    offers_promotions BOOLEAN DEFAULT TRUE,
    security_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔌 API Endpoints

### Notifications API

#### 1. Get Notifications
```
GET /api/v1/notifications
Query Parameters:
  - page (optional): Page number (default: 1)
  - limit (optional): Items per page (default: 20)
  - type (optional): Filter by type (offer, order, security, review)
  - read (optional): Filter by read status (true/false)

Response:
{
  "success": true,
  "data": [
    {
      "id": "notif_001",
      "type": "order",
      "title": "Your order has shipped",
      "message": "Track your package...",
      "read": false,
      "icon": "📦",
      "action_url": "/orders/123",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### 2. Get Unread Count
```
GET /api/v1/notifications/unread-count

Response:
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

#### 3. Mark as Read
```
PUT /api/v1/notifications/{notificationId}/read

Response:
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### 4. Mark All as Read
```
PUT /api/v1/notifications/mark-all-read

Response:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

#### 5. Delete Notification
```
DELETE /api/v1/notifications/{notificationId}

Response:
{
  "success": true,
  "message": "Notification deleted"
}
```

---

### Support API

#### 1. Get FAQs
```
GET /api/v1/support/faqs
Query Parameters:
  - category (optional): Filter by category
  - limit (optional): Items to return

Response:
{
  "success": true,
  "data": [
    {
      "id": "faq_001",
      "category": "Orders",
      "question": "How do I track my order?",
      "answer": "You can track your order by..."
    }
  ]
}
```

#### 2. Search FAQs
```
GET /api/v1/support/faqs/search?q={query}

Response:
{
  "success": true,
  "data": [
    {
      "id": "faq_001",
      "category": "Orders",
      "question": "How do I track my order?",
      "answer": "You can track your order by...",
      "relevance_score": 0.95
    }
  ]
}
```

#### 3. Get Support Tickets
```
GET /api/v1/support/tickets
Query Parameters:
  - status (optional): Filter by status (open, pending, resolved, closed)
  - page (optional): Page number
  - limit (optional): Items per page

Response:
{
  "success": true,
  "data": [
    {
      "id": "ticket_001",
      "ticket_number": "84682C",
      "subject": "Issue with item #123",
      "description": "The sofa I received...",
      "status": "resolved",
      "priority": "medium",
      "category": "Product Issue",
      "created_at": "2024-01-10T14:30:00Z",
      "updated_at": "2024-01-12T10:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3
  }
}
```

#### 4. Get Ticket by ID
```
GET /api/v1/support/tickets/{ticketId}

Response:
{
  "success": true,
  "data": {
    "id": "ticket_001",
    "ticket_number": "84682C",
    "subject": "Issue with item #123",
    "description": "The sofa I received...",
    "status": "resolved",
    "priority": "medium",
    "category": "Product Issue",
    "created_at": "2024-01-10T14:30:00Z",
    "updated_at": "2024-01-12T10:15:00Z",
    "messages": [
      {
        "id": "msg_001",
        "sender": "customer",
        "message": "The sofa I received has a defect",
        "timestamp": "2024-01-10T14:30:00Z",
        "attachments": []
      },
      {
        "id": "msg_002",
        "sender": "support",
        "sender_name": "Priya Sharma",
        "message": "We apologize for the inconvenience...",
        "timestamp": "2024-01-11T09:00:00Z",
        "attachments": []
      }
    ]
  }
}
```

#### 5. Create Ticket
```
POST /api/v1/support/tickets
Content-Type: application/json

Request Body:
{
  "subject": "Issue with my order",
  "category": "Product Issue",
  "description": "Detailed description of the issue...",
  "priority": "medium"
}

Response:
{
  "success": true,
  "data": {
    "id": "ticket_003",
    "ticket_number": "A1B2C3",
    "subject": "Issue with my order",
    "status": "open",
    "created_at": "2024-01-15T16:45:00Z"
  },
  "message": "Ticket created successfully"
}
```

#### 6. Add Message to Ticket
```
POST /api/v1/support/tickets/{ticketId}/messages
Content-Type: application/json

Request Body:
{
  "message": "Thank you for the update!"
}

Response:
{
  "success": true,
  "data": {
    "id": "msg_005",
    "message": "Thank you for the update!",
    "timestamp": "2024-01-15T17:00:00Z"
  },
  "message": "Message added successfully"
}
```

#### 7. Close Ticket
```
PUT /api/v1/support/tickets/{ticketId}/close

Response:
{
  "success": true,
  "message": "Ticket closed successfully"
}
```

#### 8. Reopen Ticket
```
PUT /api/v1/support/tickets/{ticketId}/reopen

Response:
{
  "success": true,
  "message": "Ticket reopened successfully"
}
```

#### 9. Get Contact Info
```
GET /api/v1/support/contact-info

Response:
{
  "success": true,
  "data": {
    "phone": {
      "number": "+91 1800-123-4567",
      "available": "Mon-Fri, 9am - 6pm"
    },
    "email": {
      "address": "support@woodzon.com",
      "response_time": "Response within 24 hours"
    },
    "live_chat": {
      "available": true,
      "availability": "Available 24/7"
    }
  }
}
```

---

## 🎨 UI Components

### Notifications Page Features
- ✅ Grouped by Today / Yesterday / Older
- ✅ Different notification types with icons (order, offer, security, review)
- ✅ Read/Unread status with visual indicators
- ✅ "Mark all as read" functionality
- ✅ Click to navigate to related pages
- ✅ Time ago display (e.g., "2h ago", "Yesterday")

### Help & Support Page Features
- ✅ Search bar for FAQs
- ✅ Expandable/collapsible FAQ sections
- ✅ Contact options (Live Chat, Call, Email)
- ✅ Recent tickets display
- ✅ Create new ticket button

### Support Tickets Page Features
- ✅ Filter tabs (All, Open, Pending, Resolved)
- ✅ Ticket list with status badges
- ✅ Create new ticket button
- ✅ Ticket details (subject, ID, date, category)

### Ticket Detail Page Features
- ✅ Message thread display
- ✅ Customer vs Support message differentiation
- ✅ Reply form (disabled for resolved tickets)
- ✅ Reopen ticket option
- ✅ Status badge

### Create Ticket Page Features
- ✅ Subject input
- ✅ Category dropdown
- ✅ Priority selection (Low, Medium, High)
- ✅ Description textarea
- ✅ Form validation

---

## 🚀 Routes Added

```javascript
/notifications              → Notifications page
/support                    → Help & Support main page
/support/tickets            → Support tickets list
/support/tickets/new        → Create new ticket
/support/tickets/:id        → Ticket detail page
```

---

## 📱 Header Integration

The Header component now includes:
1. **Notification Bell Icon** - Shows unread count badge
2. **Help Icon** - Quick access to Help & Support

Both icons are positioned between the search bar and wishlist icon.

---

## 🔧 Backend Implementation Notes

### Notification System
1. Create notifications when:
   - Order status changes
   - New offers/promotions
   - Security events (password change, new login)
   - Review requests

2. Use background jobs/cron to:
   - Clean up old read notifications (>30 days)
   - Send push notifications
   - Send email digests

### Support Ticket System
1. Auto-generate unique ticket numbers
2. Send email notifications on:
   - New ticket creation
   - New message from support
   - Ticket status change

3. Implement SLA tracking:
   - First response time
   - Resolution time
   - Track by priority level

### Search Functionality
1. Implement full-text search for FAQs
2. Use relevance scoring
3. Track popular searches to improve FAQs

---

## 🎯 Testing Checklist

### Notifications
- [ ] View notifications list
- [ ] Mark single notification as read
- [ ] Mark all notifications as read
- [ ] Click notification to navigate
- [ ] Verify unread count in header badge
- [ ] Test grouping (Today/Yesterday/Older)

### Help & Support
- [ ] Search FAQs
- [ ] Expand/collapse FAQ items
- [ ] Click contact options
- [ ] View recent tickets
- [ ] Navigate to create ticket

### Support Tickets
- [ ] View all tickets
- [ ] Filter by status
- [ ] Create new ticket
- [ ] View ticket details
- [ ] Add message to ticket
- [ ] Close ticket
- [ ] Reopen ticket

---

## 📊 Mock Data

The application includes comprehensive mock data for development:
- 7 sample notifications (various types and dates)
- 8 FAQs across different categories
- 3 sample support tickets with message threads
- Contact information

Mock data automatically falls back when backend is unavailable.

---

## 🎨 Design Consistency

All pages follow the existing Woodzon design system:
- Background color: `#F5F0E8` (light cream)
- Primary color: `#8B4513` (brown)
- Accent color: `#FF6B35` (orange)
- White containers with rounded corners
- Consistent padding and spacing
- Mobile-responsive design

---

## 📝 Next Steps

1. **Backend Implementation**
   - Set up database tables
   - Implement API endpoints
   - Add authentication middleware
   - Set up email notifications

2. **Enhancements**
   - Add file attachment support for tickets
   - Implement live chat functionality
   - Add push notifications
   - Create admin panel for managing tickets

3. **Testing**
   - Write unit tests
   - Integration tests
   - E2E tests
   - Load testing for notifications

---

## 🆘 Support

For questions or issues with this integration, please contact the development team or create a support ticket! 😊

