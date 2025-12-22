import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ============================================
// 🔧 API CONFIGURATION LOGGING
// ============================================
const isDevelopment = import.meta.env.DEV;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const enableLocalStorageFallback = import.meta.env.VITE_ENABLE_LOCALSTORAGE_FALLBACK !== 'false';

if (isDevelopment) {
  console.log('%c🌐 Woodzon Frontend - API Configuration', 'color: #8B4513; font-size: 16px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8B4513;');
  console.log('📡 API Base URL:', apiBaseUrl);
  console.log('🧪 Use Mock Data:', useMockData ? '✅ Enabled' : '❌ Disabled');
  console.log('💾 localStorage Fallback:', enableLocalStorageFallback ? '✅ Enabled' : '❌ Disabled');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8B4513;');

  if (useMockData) {
    console.log('%c⚠️ Running in MOCK MODE - Backend not required', 'color: orange; font-weight: bold;');
    console.log('   To connect to backend, set VITE_USE_MOCK_DATA=false in .env');
  } else {
    console.log('%c✅ Running in API MODE - Connecting to backend', 'color: green; font-weight: bold;');
    console.log('   Backend URL:', apiBaseUrl);
  }
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8B4513;');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

