// Mock Support Data

// FAQs
export const mockFAQs = [
  {
    id: 'faq_001',
    category: 'Orders',
    question: 'How do I track my order?',
    answer: 'You can track your order by going to "My Orders" section and clicking on the order you want to track. You\'ll see real-time updates on your package location and estimated delivery time.',
  },
  {
    id: 'faq_002',
    category: 'Returns',
    question: 'What is the return policy?',
    answer: 'We offer a 30-day return policy for most items. Products must be unused and in original packaging. To initiate a return, go to your order details and click "Return Item". Our team will arrange a free pickup.',
  },
  {
    id: 'faq_003',
    category: 'Orders',
    question: 'How to cancel an order?',
    answer: 'You can cancel an order before it ships. Go to "My Orders", select the order, and click "Cancel Order". If the order has already shipped, you\'ll need to wait for delivery and then initiate a return.',
  },
  {
    id: 'faq_004',
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Credit/Debit Cards, UPI, Net Banking, Wallets, and Cash on Delivery (COD) for eligible orders.',
  },
  {
    id: 'faq_005',
    category: 'Delivery',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-7 business days. Express delivery (available in select cities) takes 1-2 business days. You\'ll see estimated delivery dates during checkout.',
  },
  {
    id: 'faq_006',
    category: 'Account',
    question: 'How do I change my password?',
    answer: 'Go to Account Settings > Security > Change Password. You\'ll need to enter your current password and then set a new one.',
  },
  {
    id: 'faq_007',
    category: 'Products',
    question: 'Are the furniture products assembled?',
    answer: 'Most furniture items require assembly. We provide detailed assembly instructions and all necessary hardware. Professional assembly service is available for an additional fee.',
  },
  {
    id: 'faq_008',
    category: 'Warranty',
    question: 'What warranty do you offer?',
    answer: 'Warranty varies by product and seller. Most furniture items come with 1-2 years warranty. Check the product page for specific warranty information.',
  },
];

// Support Tickets
export const mockTickets = [
  {
    id: 'ticket_001',
    ticketNumber: '84682C',
    subject: 'Issue with item #123',
    description: 'The sofa I received has a manufacturing defect on the armrest.',
    status: 'resolved',
    priority: 'medium',
    category: 'Product Issue',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg_001',
        sender: 'customer',
        message: 'The sofa I received has a manufacturing defect on the armrest.',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
      },
      {
        id: 'msg_002',
        sender: 'support',
        senderName: 'Priya Sharma',
        message: 'We apologize for the inconvenience. We\'ll arrange a replacement for you. Our team will contact you within 24 hours.',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
      },
      {
        id: 'msg_003',
        sender: 'customer',
        message: 'Thank you! The replacement has been delivered and it\'s perfect.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
      },
    ],
  },
  {
    id: 'ticket_002',
    ticketNumber: '5D4E1F',
    subject: 'Question about delivery time',
    description: 'When will my order #WZ12345 be delivered? It\'s been 5 days.',
    status: 'pending',
    priority: 'high',
    category: 'Delivery',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg_004',
        sender: 'customer',
        message: 'When will my order #WZ12345 be delivered? It\'s been 5 days.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
      },
      {
        id: 'msg_005',
        sender: 'support',
        senderName: 'Rahul Kumar',
        message: 'Let me check the status of your order. Please give me a moment.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
      },
    ],
  },
  {
    id: 'ticket_003',
    ticketNumber: '3G9H8J',
    subject: 'Request for refund',
    description: 'I want to return my coffee table and get a refund.',
    status: 'open',
    priority: 'medium',
    category: 'Refund',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg_006',
        sender: 'customer',
        message: 'I want to return my coffee table and get a refund.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
      },
    ],
  },
];

// Contact Information
export const mockContactInfo = {
  phone: {
    number: '+91 1800-123-4567',
    available: 'Mon-Fri, 9am - 6pm',
  },
  email: {
    address: 'support@woodzon.com',
    responseTime: 'Response within 24 hours',
  },
  liveChat: {
    available: true,
    availability: 'Available 24/7',
  },
};

