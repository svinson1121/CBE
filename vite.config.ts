// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Optional but helpful
    },
  },
  server: {
    proxy: {
      '/api/ecbe/v1': {
        target: 'http://10.90.250.46:8080', // your backend or CBC API URL
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ''), // remove `/api` prefix before sending to backend
      },
    },
  },
});

