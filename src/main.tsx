import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { registerServiceWorker } from './utils/registerSW'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

// Register service worker for PWA
if (import.meta.env.PROD) {
    registerServiceWorker();
}
