
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Safely expose specific env vars to the client-side code with fallbacks
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.NOON_BUSINESS_UNIT': JSON.stringify(process.env.NOON_BUSINESS_UNIT || ''),
    'process.env.NOON_APP_ID': JSON.stringify(process.env.NOON_APP_ID || '')
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
