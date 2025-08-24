// File: front/vite.config.ts
// Last change: Configured Vite with server proxy and path aliases for Lakovňa

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000, // We can set a specific port for the frontend dev server
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:10002', // Our backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    alias: {
      // These aliases must match the paths in tsconfig.json
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      // Alias for the shared common package
      '@common': path.resolve(__dirname, '../common/src'),
    },
  },
});
