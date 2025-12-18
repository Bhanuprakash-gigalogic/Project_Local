/**
 * ============================================
 * 🐛 DEBUG HELPER UTILITIES
 * ============================================
 * Utilities to help with debugging the application
 */

// Enable/disable debug mode
const DEBUG_MODE = import.meta.env.DEV;

/**
 * Enhanced console.log with timestamp and context
 */
export const debugLog = (context, message, data = null) => {
  if (!DEBUG_MODE) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}] [${context}]`;
  
  if (data) {
    console.log(`%c${prefix}`, 'color: #4CAF50; font-weight: bold;', message, data);
  } else {
    console.log(`%c${prefix}`, 'color: #4CAF50; font-weight: bold;', message);
  }
};

/**
 * Log API calls
 */
export const debugAPI = (method, url, data = null) => {
  if (!DEBUG_MODE) return;
  
  console.group(`%c🌐 API ${method}`, 'color: #2196F3; font-weight: bold;');
  console.log('URL:', url);
  if (data) console.log('Data:', data);
  console.groupEnd();
};

/**
 * Log API responses
 */
export const debugAPIResponse = (url, response, error = null) => {
  if (!DEBUG_MODE) return;
  
  if (error) {
    console.group(`%c❌ API Error`, 'color: #f44336; font-weight: bold;');
    console.log('URL:', url);
    console.error('Error:', error);
    console.groupEnd();
  } else {
    console.group(`%c✅ API Success`, 'color: #4CAF50; font-weight: bold;');
    console.log('URL:', url);
    console.log('Response:', response);
    console.groupEnd();
  }
};

/**
 * Log state changes
 */
export const debugState = (component, stateName, oldValue, newValue) => {
  if (!DEBUG_MODE) return;
  
  console.group(`%c🔄 State Change: ${component}`, 'color: #FF9800; font-weight: bold;');
  console.log(`${stateName}:`, { old: oldValue, new: newValue });
  console.groupEnd();
};

/**
 * Log localStorage operations
 */
export const debugStorage = (operation, key, value = null) => {
  if (!DEBUG_MODE) return;
  
  const emoji = operation === 'get' ? '📖' : operation === 'set' ? '💾' : '🗑️';
  console.log(`%c${emoji} localStorage.${operation}`, 'color: #9C27B0; font-weight: bold;', key, value || '');
};

/**
 * Performance timer
 */
export class DebugTimer {
  constructor(label) {
    this.label = label;
    this.startTime = performance.now();
  }
  
  end() {
    if (!DEBUG_MODE) return;
    
    const duration = (performance.now() - this.startTime).toFixed(2);
    console.log(`%c⏱️ ${this.label}`, 'color: #00BCD4; font-weight: bold;', `${duration}ms`);
  }
}

/**
 * Debug component render
 */
export const debugRender = (componentName, props = null) => {
  if (!DEBUG_MODE) return;
  
  console.log(`%c🎨 Render: ${componentName}`, 'color: #E91E63; font-weight: bold;', props || '');
};

/**
 * Inspect current app state
 */
export const inspectAppState = () => {
  if (!DEBUG_MODE) return;
  
  console.group('%c🔍 App State Inspector', 'color: #673AB7; font-size: 14px; font-weight: bold;');
  
  // localStorage data
  console.group('💾 localStorage');
  console.log('Cart:', JSON.parse(localStorage.getItem('cart') || '[]'));
  console.log('Wishlist:', JSON.parse(localStorage.getItem('wishlist') || '[]'));
  console.log('Addresses:', JSON.parse(localStorage.getItem('mockAddresses') || '[]'));
  console.log('Token:', localStorage.getItem('token'));
  console.log('Zone:', JSON.parse(localStorage.getItem('selectedZone') || 'null'));
  console.groupEnd();
  
  // Environment
  console.group('⚙️ Environment');
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('Use Mock Data:', import.meta.env.VITE_USE_MOCK_DATA);
  console.log('localStorage Fallback:', import.meta.env.VITE_ENABLE_LOCALSTORAGE_FALLBACK);
  console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_KEY_ID);
  console.groupEnd();
  
  // Network info
  console.group('🌐 Network');
  console.log('Online:', navigator.onLine);
  console.log('Connection:', navigator.connection?.effectiveType || 'unknown');
  console.groupEnd();
  
  console.groupEnd();
};

/**
 * Clear all debug data
 */
export const clearDebugData = () => {
  localStorage.clear();
  console.log('%c🧹 All localStorage data cleared', 'color: #FF5722; font-weight: bold;');
};

/**
 * Export debug helpers to window for console access
 */
if (DEBUG_MODE && typeof window !== 'undefined') {
  window.debugWoodzon = {
    inspect: inspectAppState,
    clear: clearDebugData,
    log: debugLog,
    timer: DebugTimer,
  };
  
  console.log(
    '%c🐛 Debug Mode Enabled',
    'color: #4CAF50; font-size: 16px; font-weight: bold; background: #000; padding: 5px 10px; border-radius: 3px;'
  );
  console.log(
    '%cType window.debugWoodzon.inspect() to inspect app state',
    'color: #2196F3; font-style: italic;'
  );
}

export default {
  log: debugLog,
  api: debugAPI,
  apiResponse: debugAPIResponse,
  state: debugState,
  storage: debugStorage,
  render: debugRender,
  Timer: DebugTimer,
  inspect: inspectAppState,
  clear: clearDebugData,
};

