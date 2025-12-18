/**
 * ============================================
 * 🔧 API HELPER UTILITY
 * ============================================
 * This utility helps transition from mock data to real API
 * When backend goes live, just update .env file
 */

// Feature flags from environment
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const ENABLE_LOCALSTORAGE_FALLBACK = import.meta.env.VITE_ENABLE_LOCALSTORAGE_FALLBACK !== 'false';

/**
 * Wrapper for API calls with automatic fallback
 * @param {Function} apiCall - The API function to call
 * @param {Function} fallbackFn - Fallback function if API fails
 * @param {string} storageKey - localStorage key for data persistence
 */
export const apiWithFallback = async (apiCall, fallbackFn, storageKey = null) => {
  try {
    // Try real API call
    const response = await apiCall();
    console.log('✅ API call successful');
    return response;
  } catch (error) {
    console.log('⚠️ API call failed, using fallback');
    
    // If localStorage fallback is enabled and key is provided
    if (ENABLE_LOCALSTORAGE_FALLBACK && storageKey) {
      const cachedData = localStorage.getItem(storageKey);
      if (cachedData) {
        console.log(`📦 Using cached data from localStorage: ${storageKey}`);
        return { data: JSON.parse(cachedData) };
      }
    }
    
    // Use fallback function
    if (fallbackFn) {
      return fallbackFn();
    }
    
    throw error;
  }
};

/**
 * Save data to localStorage
 */
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`💾 Saved to localStorage: ${key}`);
  } catch (error) {
    console.error('❌ Failed to save to localStorage:', error);
  }
};

/**
 * Get data from localStorage
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('❌ Failed to read from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed from localStorage: ${key}`);
  } catch (error) {
    console.error('❌ Failed to remove from localStorage:', error);
  }
};

/**
 * Check if API is available
 */
export const checkAPIHealth = async (baseURL) => {
  try {
    const response = await fetch(`${baseURL}/health`, { method: 'GET' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Format API error for user display
 */
export const formatAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

/**
 * Log API configuration (development only)
 */
export const logAPIConfig = () => {
  if (import.meta.env.DEV) {
    console.log('🔧 API Configuration:');
    console.log('  - Base URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('  - Use Mock Data:', USE_MOCK_DATA);
    console.log('  - localStorage Fallback:', ENABLE_LOCALSTORAGE_FALLBACK);
  }
};

// Export feature flags
export { USE_MOCK_DATA, ENABLE_LOCALSTORAGE_FALLBACK };

