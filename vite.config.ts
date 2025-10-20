import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    hmr: {
      protocol: 'ws'
    }
  },
  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries (React ecosystem)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Firebase services
          'firebase': [
            'firebase/app', 
            'firebase/firestore', 
            'firebase/auth', 
            'firebase/storage'
          ],
          
          // UI libraries
          'ui-vendor': [
            'framer-motion', 
            'react-hot-toast', 
            'lucide-react'
          ],
          
          // Form and validation
          'form-vendor': [
            'react-hook-form', 
            '@hookform/resolvers', 
            'zod'
          ],
          
          // Admin panel (lazy loaded)
          'admin': [
            './src/components/adminPanel/AdminPanel',
            './src/components/adminPanel/ProductForm',
            './src/components/adminPanel/ProductList'
          ]
        }
      }
    },
    // Increase chunk size warning limit to 1000kB
    chunkSizeWarningLimit: 1000,
    
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  }
})
