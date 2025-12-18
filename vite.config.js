import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Use basicSsl for immediate HTTPS (self-signed)
    // For trusted certificates, install mkcert and generate certs
    basicSsl()
  ],
  server: {
    https: true,
    port: 3002,
    open: true,
    host: '0.0.0.0' // Allow network access - accessible via 192.168.0.7:3002
  },
  build: {
    sourcemap: true, // Enable source maps for debugging
    minify: false, // Disable minification for easier debugging
  },
  // Enable source maps in development
  css: {
    devSourcemap: true
  }
})

