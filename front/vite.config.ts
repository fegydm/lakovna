// File: front/vite.config.ts
// Last change: Removed path aliases and updated the server port for Lakovňa.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3002, // Port for the Lakovňa frontend dev server
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:10002', // Backend port for Lakovňa
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
