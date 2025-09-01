// File: front/vite.config.ts
// Last change: Restored root alias for common/ imports, kept proxy for backend API.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      common: path.resolve(__dirname, '../common'),
      // môžeš pridať ďalšie aliasy podľa potreby
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 3002, // Lakovňa frontend dev server
    proxy: {
      '/api': {
        target: 'http://localhost:10002', // Lakovňa backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
