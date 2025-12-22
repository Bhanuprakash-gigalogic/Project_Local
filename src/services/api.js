import axios from 'axios';

// ============================================
// 🌐 BASE URL - UNIVERSAL FOR ALL FRONTEND
// ============================================
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || (isDevelopment
  ? 'http://localhost:8080/api/v1'
  : 'https://api.yourdomain.com/api/v1');

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';

// Log in development
if (isDevelopment) {
  console.log('🔧 API Base URL:', BASE_URL);
  console.log('🔑 Razorpay Key:', RAZORPAY_KEY_ID);
}

// ============================================
// AXIOS INSTANCE WITH AUTO-AUTH
// ============================================
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Auto-attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }

    // Suppress console errors for connection refused (backend not running)
    // The app will fall back to mock data automatically
    if (error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ERR_CONNECTION_REFUSED' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('ERR_CONNECTION_REFUSED')) {
      // Silently fail - mock data will be used
      // Don't log anything to keep console clean
      return Promise.reject({
        ...error,
        silent: true,
        message: 'Backend not available - using mock data'
      });
    }

    return Promise.reject(error);
  }
);

// ============================================
// 🔵 ZONE DETECTION
// ============================================
export const zoneAPI = {
  detectZone: (lat, lng, accuracy_meters = null) =>
    api.post(`/catalog/zones/locate`, { lat, lng, accuracy_meters }),
  getCurrentZone: () => api.get(`/catalog/zones/current`),
};

// ============================================
// 🟣 STORES & SELLERS
// ============================================
export const storesAPI = {
  getDefaultStore: () => api.get(`/catalog/stores/default`),
  getStoreById:  (storeId) => api.get(`/catalog/stores/${storeId}`),
  getStoreBanners: (storeId) => api.get(`/catalog/stores/${storeId}/banners`),
  getSellers: (params) => api.get(`/catalog/sellers`, { params }),
  getTopSellers: (params) => api.get(`/catalog/sellers/top`, { params }),
  getSellerById: (sellerId) => api.get(`/catalog/sellers/${sellerId}`),
  getStoresByCategory: (params) => api.get(`/catalog/sellers`, { params }),
};

// ============================================
// 🎨 BANNERS
// ============================================
export const bannersAPI = {
  getActiveBanners: (params) => api.get(`/catalog/banners/active`, { params }),
};

// ============================================
// 🟠 PRODUCTS
// ============================================
export const productsAPI = {
  getProducts: (params) => api.get(`/catalog/products`, { params }),
  getProductById: (productId) => api.get(`/catalog/products/${productId}`),
  getNewArrivals: (params) => api.get(`/catalog/products/new`, { params }),
  getTrending: (params) => api.get(`/catalog/products/trending`, { params }),
  getDeals: (params) => api.get(`/catalog/products/deals`, { params }),
  getSimilarProducts: (productId) => api.get(`/catalog/products/similar/${productId}`),
  getRelatedProducts: (productId) => api.get(`/catalog/products/related/${productId}`),
  getProductReviews: (productId, params) => api.get(`/catalog/products/reviews/${productId}`, { params }),
  getSearchSuggestions: (query) => api.get(`/catalog/products/search-suggestions`, { params: { q: query } }),
};

// ============================================
// 📂 CATEGORIES
// ============================================
export const categoriesAPI = {
  getCategoryTree: (params) => api.get(`/catalog/categories/tree`, { params }),
  getFlatCategories: () => api.get(`/catalog/categories/flat`),
};

// ============================================
// 🔍 FILTERS
// ============================================
export const filtersAPI = {
  getFilters: (params) => api.get(`/catalog/filters`, { params }),
};

// ============================================
// 🟢 WISHLIST (Requires Auth)
// ============================================
export const wishlistAPI = {
  addToWishlist: (productId, variation = null) =>
    api.post(`/cart/wishlist/add`, { product_id: productId, variation }),
  getWishlist: (params) => api.get(`/cart/wishlist`, { params }),
  removeFromWishlist: (productId) =>
    api.delete(`/cart/wishlist/remove`, { data: { product_id: productId } }),
};

// ============================================
// 🛒 CART (Requires Auth)
// ============================================
export const cartAPI = {
  getCart: () => api.get(`/cart`),
  getCartSummary: () => api.get(`/cart/summary`),
  addToCart: (productId, quantity = 1, variation = null) =>
    api.post(`/cart/items`, { product_id: productId, quantity, variation }),
  updateCartItem: (itemId, quantity, variation = null) =>
    api.put(`/cart/items/${itemId}`, { quantity, ...(variation && { variation }) }),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  removeSellerItems: (sellerId) => api.delete(`/cart/items/seller/${sellerId}`),
  clearCart: () => api.delete(`/cart/clear`),
  applyCoupon: (sellerId, couponCode) =>
    api.post(`/cart/apply-coupon`, { seller_id: sellerId, coupon_code: couponCode }),
  removeCoupon: (sellerId) => api.delete(`/cart/remove-coupon/${sellerId}`),
  moveToWishlist: (itemId) => api.post(`/cart/move-to-wishlist`, { item_id: itemId }),
  moveFromWishlist: (wishlistId, quantity = 1) =>
    api.post(`/cart/move-from-wishlist`, { wishlist_id: wishlistId, quantity }),
};

// ============================================
// 📍 ADDRESS (Requires Auth)
// ============================================
export const addressAPI = {
  getAddresses: () => api.get(`/orders/addresses`),
  addAddress: (addressData) => api.post(`/orders/addresses`, addressData),
  updateAddress: (addressId, addressData) => api.put(`/orders/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/orders/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.post(`/orders/addresses/${addressId}/set-default`),
};

// ============================================
// 🟡 CHECKOUT (Requires Auth)
// ============================================
export const checkoutAPI = {
  getCheckoutSummary: (cartId, addressId) =>
    api.get(`/orders/checkout/summary`, { params: { cart_id: cartId, address_id: addressId } }),
};

// ============================================
// 🟡 ORDERS & PAYMENT (Requires Auth)
// ============================================
export const ordersAPI = {
  getOrders: (params) => api.get(`/orders`, { params }),
  getActiveOrders: () => api.get(`/orders/active`),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  createOrder: (orderData) => api.post(`/orders/create`, orderData),
  createOnlineOrder: (orderData) => api.post(`/orders/create/online`, orderData),
  verifyRazorpayPayment: (paymentData) => api.post(`/orders/razorpay/verify`, paymentData),
  getPaymentStatus: (orderId) => api.get(`/orders/${orderId}/payment-status`),
  retryPayment: (orderId) => api.post(`/orders/${orderId}/retry-payment`),
  getOrderTracking: (orderId) => api.get(`/orders/${orderId}/track`),
  getInvoice: (orderId) => api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' }),
  cancelOrder: (orderId, reason) => api.post(`/orders/${orderId}/cancel`, { reason }),
  initiateReturn: (orderId, returnData) => api.post(`/orders/${orderId}/return`, returnData),
  requestReplacement: (orderId, formData) =>
    api.post(`/orders/${orderId}/replace`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  reportIssue: (orderId, formData) =>
    api.post(`/orders/${orderId}/issue`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getReturnStatus: (orderId) => api.get(`/orders/${orderId}/return-status`),
  confirmPickup: (orderId) => api.post(`/orders/${orderId}/return/confirm-pickup`),
  uploadReturnProof: (orderId, formData) =>
    api.post(`/orders/${orderId}/return/upload-proof`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  rateDelivery: (orderId, ratingData) => api.post(`/orders/${orderId}/rate-delivery`, ratingData),
};

// ============================================
// 🟣 REVIEWS & RATINGS (Requires Auth)
// ============================================
export const reviewsAPI = {
  submitProductReview: (reviewData) => {
    if (reviewData instanceof FormData) {
      return api.post(`/reviews/product`, reviewData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post(`/reviews/product`, reviewData);
  },
  submitSellerReview: (reviewData) => api.post(`/reviews/seller`, reviewData),
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  getSellerReviews: (sellerId, params) => api.get(`/reviews/seller/${sellerId}`, { params }),
  getMyPendingReviews: () => api.get(`/reviews/my-pending`),
  getMySubmittedReviews: () => api.get(`/reviews/my-submitted`),
  editProductReview: (reviewId, reviewData) => {
    if (reviewData instanceof FormData) {
      return api.put(`/reviews/product/${reviewId}`, reviewData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`/reviews/product/${reviewId}`, reviewData);
  },
  deleteProductReview: (reviewId) => api.delete(`/reviews/product/${reviewId}`),
  markReviewHelpful: (reviewId, helpful) => api.post(`/reviews/product/${reviewId}/helpful`, { helpful }),
  reportReview: (reviewId, reportData) => api.post(`/reviews/report/${reviewId}`, reportData),
};

// ============================================
// 🔔 NOTIFICATIONS (Requires Auth)
// ============================================
export const notificationsAPI = {
  getNotifications: (params) => api.get(`/notifications`, { params }),
  getUnreadCount: () => api.get(`/notifications/unread-count`),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put(`/notifications/mark-all-read`),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
  getNotificationSettings: () => api.get(`/notifications/settings`),
  updateNotificationSettings: (settings) => api.put(`/notifications/settings`, settings),
};

// ============================================
// 🆘 HELP & SUPPORT (Requires Auth)
// ============================================
export const supportAPI = {
  // FAQ
  getFAQs: (params) => api.get(`/support/faqs`, { params }),
  searchFAQs: (query) => api.get(`/support/faqs/search`, { params: { q: query } }),

  // Support Tickets
  getTickets: (params) => api.get(`/support/tickets`, { params }),
  getTicketById: (ticketId) => api.get(`/support/tickets/${ticketId}`),
  createTicket: (ticketData) => {
    if (ticketData instanceof FormData) {
      return api.post(`/support/tickets`, ticketData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post(`/support/tickets`, ticketData);
  },
  addTicketMessage: (ticketId, messageData) => {
    if (messageData instanceof FormData) {
      return api.post(`/support/tickets/${ticketId}/messages`, messageData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post(`/support/tickets/${ticketId}/messages`, messageData);
  },
  closeTicket: (ticketId) => api.put(`/support/tickets/${ticketId}/close`),
  reopenTicket: (ticketId) => api.put(`/support/tickets/${ticketId}/reopen`),
  rateTicket: (ticketId, rating, feedback) => api.post(`/support/tickets/${ticketId}/rate`, { rating, feedback }),

  // Live Chat
  initiateLiveChat: () => api.post(`/support/chat/initiate`),
  getChatHistory: (chatId) => api.get(`/support/chat/${chatId}/history`),
  sendChatMessage: (chatId, message) => api.post(`/support/chat/${chatId}/message`, { message }),
  endChat: (chatId) => api.post(`/support/chat/${chatId}/end`),

  // Contact
  getContactInfo: () => api.get(`/support/contact-info`),
  submitContactForm: (formData) => api.post(`/support/contact`, formData),
};

// ============================================
// 🛠️ HELPER: Safe API Call with Mock Fallback
// ============================================
/**
 * Wraps an API call to gracefully handle errors and provide mock data fallback
 * @param {Function} apiCall - The API function to call
 * @param {*} mockData - The mock data to return if API fails
 * @param {string} logMessage - Optional log message for debugging
 * @returns {Promise} - Resolves with API data or mock data
 */
export const safeAPICall = async (apiCall, mockData, logMessage = '') => {
  try {
    const response = await apiCall();
    if (isDevelopment && logMessage) {
      console.log(`✅ ${logMessage}:`, response.data);
    }
    return { success: true, data: response.data, source: 'api' };
  } catch (error) {
    // Check if it's a network error
    const isNetworkError = error.code === 'ERR_NETWORK' ||
                          error.code === 'ECONNREFUSED' ||
                          error.code === 'ERR_CONNECTION_REFUSED' ||
                          error.message?.includes('Network Error') ||
                          error.message?.includes('ERR_CONNECTION_REFUSED') ||
                          error.silent;

    // Only log non-network errors in development
    if (isDevelopment && !isNetworkError) {
      console.warn(`⚠️ ${logMessage} failed:`, error.message);
    }

    // Silently use mock data for network errors
    return { success: false, data: mockData, source: 'mock', error };
  }
};

export default api;

