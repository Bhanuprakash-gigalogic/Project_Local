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
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      // Silently fail - mock data will be used
      if (isDevelopment) {
        console.log('📡 Backend not available, using mock data');
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// 🔵 ZONE DETECTION
// ============================================
export const zoneAPI = {
  detectZone: (lat, lng, accuracy_meters = null) =>
    axios.post(`${BASE_URL}/catalog/zones/locate`, { lat, lng, accuracy_meters }),
  getCurrentZone: () => api.get(`${BASE_URL}/catalog/zones/current`),
};

// ============================================
// 🟣 STORES & SELLERS
// ============================================
export const storesAPI = {
  getDefaultStore: () => axios.get(`${BASE_URL}/catalog/stores/default`),
  getStoreById:  (storeId) => axios.get(`${BASE_URL}/catalog/stores/${storeId}`),
  getStoreBanners: (storeId) => axios.get(`${BASE_URL}/catalog/stores/${storeId}/banners`),
  getSellers: (params) => axios.get(`${BASE_URL}/catalog/sellers`, { params }),
  getTopSellers: (params) => axios.get(`${BASE_URL}/catalog/sellers/top`, { params }),
  getSellerById: (sellerId) => axios.get(`${BASE_URL}/catalog/sellers/${sellerId}`),
  getStoresByCategory: (params) => axios.get(`${BASE_URL}/catalog/sellers`, { params }),
};

// ============================================
// 🎨 BANNERS
// ============================================
export const bannersAPI = {
  getActiveBanners: (params) => axios.get(`${BASE_URL}/catalog/banners/active`, { params }),
};

// ============================================
// 🟠 PRODUCTS
// ============================================
export const productsAPI = {
  getProducts: (params) => axios.get(`${BASE_URL}/catalog/products`, { params }),
  getProductById: (productId) => axios.get(`${BASE_URL}/catalog/products/${productId}`),
  getNewArrivals: (params) => axios.get(`${BASE_URL}/catalog/products/new`, { params }),
  getTrending: (params) => axios.get(`${BASE_URL}/catalog/products/trending`, { params }),
  getDeals: (params) => axios.get(`${BASE_URL}/catalog/products/deals`, { params }),
  getSimilarProducts: (productId) => axios.get(`${BASE_URL}/catalog/products/similar/${productId}`),
  getRelatedProducts: (productId) => axios.get(`${BASE_URL}/catalog/products/related/${productId}`),
  getProductReviews: (productId, params) => axios.get(`${BASE_URL}/catalog/products/reviews/${productId}`, { params }),
  getSearchSuggestions: (query) => axios.get(`${BASE_URL}/catalog/products/search-suggestions`, { params: { q: query } }),
};

// ============================================
// 📂 CATEGORIES
// ============================================
export const categoriesAPI = {
  getCategoryTree: (params) => axios.get(`${BASE_URL}/catalog/categories/tree`, { params }),
  getFlatCategories: () => axios.get(`${BASE_URL}/catalog/categories/flat`),
};

// ============================================
// 🔍 FILTERS
// ============================================
export const filtersAPI = {
  getFilters: (params) => axios.get(`${BASE_URL}/catalog/filters`, { params }),
};

// ============================================
// 🟢 WISHLIST (Requires Auth)
// ============================================
export const wishlistAPI = {
  addToWishlist: (productId, variation = null) =>
    api.post(`${BASE_URL}/cart/wishlist/add`, { product_id: productId, variation }),
  getWishlist: (params) => api.get(`${BASE_URL}/cart/wishlist`, { params }),
  removeFromWishlist: (productId) =>
    api.delete(`${BASE_URL}/cart/wishlist/remove`, { data: { product_id: productId } }),
};

// ============================================
// 🛒 CART (Requires Auth)
// ============================================
export const cartAPI = {
  getCart: () => api.get(`${BASE_URL}/cart`),
  getCartSummary: () => api.get(`${BASE_URL}/cart/summary`),
  addToCart: (productId, quantity = 1, variation = null) =>
    api.post(`${BASE_URL}/cart/items`, { product_id: productId, quantity, variation }),
  updateCartItem: (itemId, quantity, variation = null) =>
    api.put(`${BASE_URL}/cart/items/${itemId}`, { quantity, ...(variation && { variation }) }),
  removeFromCart: (itemId) => api.delete(`${BASE_URL}/cart/items/${itemId}`),
  removeSellerItems: (sellerId) => api.delete(`${BASE_URL}/cart/items/seller/${sellerId}`),
  clearCart: () => api.delete(`${BASE_URL}/cart/clear`),
  applyCoupon: (sellerId, couponCode) =>
    api.post(`${BASE_URL}/cart/apply-coupon`, { seller_id: sellerId, coupon_code: couponCode }),
  removeCoupon: (sellerId) => api.delete(`${BASE_URL}/cart/remove-coupon/${sellerId}`),
  moveToWishlist: (itemId) => api.post(`${BASE_URL}/cart/move-to-wishlist`, { item_id: itemId }),
  moveFromWishlist: (wishlistId, quantity = 1) =>
    api.post(`${BASE_URL}/cart/move-from-wishlist`, { wishlist_id: wishlistId, quantity }),
};

// ============================================
// 📍 ADDRESS (Requires Auth)
// ============================================
export const addressAPI = {
  getAddresses: () => api.get(`${BASE_URL}/orders/addresses`),
  addAddress: (addressData) => api.post(`${BASE_URL}/orders/addresses`, addressData),
  updateAddress: (addressId, addressData) => api.put(`${BASE_URL}/orders/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`${BASE_URL}/orders/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.post(`${BASE_URL}/orders/addresses/${addressId}/set-default`),
};

// ============================================
// 🟡 CHECKOUT (Requires Auth)
// ============================================
export const checkoutAPI = {
  getCheckoutSummary: (cartId, addressId) =>
    api.get(`${BASE_URL}/orders/checkout/summary`, { params: { cart_id: cartId, address_id: addressId } }),
};

// ============================================
// 🟡 ORDERS & PAYMENT (Requires Auth)
// ============================================
export const ordersAPI = {
  getOrders: (params) => api.get(`${BASE_URL}/orders`, { params }),
  getActiveOrders: () => api.get(`${BASE_URL}/orders/active`),
  getOrderById: (orderId) => api.get(`${BASE_URL}/orders/${orderId}`),
  createOrder: (orderData) => api.post(`${BASE_URL}/orders/create`, orderData),
  createOnlineOrder: (orderData) => api.post(`${BASE_URL}/orders/create/online`, orderData),
  verifyRazorpayPayment: (paymentData) => api.post(`${BASE_URL}/orders/razorpay/verify`, paymentData),
  getPaymentStatus: (orderId) => api.get(`${BASE_URL}/orders/${orderId}/payment-status`),
  retryPayment: (orderId) => api.post(`${BASE_URL}/orders/${orderId}/retry-payment`),
  getOrderTracking: (orderId) => api.get(`${BASE_URL}/orders/${orderId}/track`),
  getInvoice: (orderId) => api.get(`${BASE_URL}/orders/${orderId}/invoice`, { responseType: 'blob' }),
  cancelOrder: (orderId, reason) => api.post(`${BASE_URL}/orders/${orderId}/cancel`, { reason }),
  initiateReturn: (orderId, returnData) => api.post(`${BASE_URL}/orders/${orderId}/return`, returnData),
  requestReplacement: (orderId, formData) =>
    api.post(`${BASE_URL}/orders/${orderId}/replace`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  reportIssue: (orderId, formData) =>
    api.post(`${BASE_URL}/orders/${orderId}/issue`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getReturnStatus: (orderId) => api.get(`${BASE_URL}/orders/${orderId}/return-status`),
  confirmPickup: (orderId) => api.post(`${BASE_URL}/orders/${orderId}/return/confirm-pickup`),
  uploadReturnProof: (orderId, formData) =>
    api.post(`${BASE_URL}/orders/${orderId}/return/upload-proof`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  rateDelivery: (orderId, ratingData) => api.post(`${BASE_URL}/orders/${orderId}/rate-delivery`, ratingData),
};

// ============================================
// 🟣 REVIEWS & RATINGS (Requires Auth)
// ============================================
export const reviewsAPI = {
  submitProductReview: (reviewData) => {
    if (reviewData instanceof FormData) {
      return api.post(`${BASE_URL}/reviews/product`, reviewData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post(`${BASE_URL}/reviews/product`, reviewData);
  },
  submitSellerReview: (reviewData) => api.post(`${BASE_URL}/reviews/seller`, reviewData),
  getProductReviews: (productId, params) => api.get(`${BASE_URL}/reviews/product/${productId}`, { params }),
  getSellerReviews: (sellerId, params) => api.get(`${BASE_URL}/reviews/seller/${sellerId}`, { params }),
  getMyPendingReviews: () => api.get(`${BASE_URL}/reviews/my-pending`),
  getMySubmittedReviews: () => api.get(`${BASE_URL}/reviews/my-submitted`),
  editProductReview: (reviewId, reviewData) => {
    if (reviewData instanceof FormData) {
      return api.put(`${BASE_URL}/reviews/product/${reviewId}`, reviewData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`${BASE_URL}/reviews/product/${reviewId}`, reviewData);
  },
  deleteProductReview: (reviewId) => api.delete(`${BASE_URL}/reviews/product/${reviewId}`),
  markReviewHelpful: (reviewId, helpful) => api.post(`${BASE_URL}/reviews/product/${reviewId}/helpful`, { helpful }),
  reportReview: (reviewId, reportData) => api.post(`${BASE_URL}/reviews/report/${reviewId}`, reportData),
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
    // Only log non-network errors in development
    if (isDevelopment && error.code !== 'ERR_NETWORK' && !error.message?.includes('Network Error')) {
      console.warn(`⚠️ ${logMessage} failed:`, error.message);
    }

    if (isDevelopment && logMessage) {
      console.log(`🔄 Using mock data for ${logMessage}`);
    }

    return { success: false, data: mockData, source: 'mock', error };
  }
};

export default api;

