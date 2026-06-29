import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: false,
    host: true,
    open: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  preview: {
    port: 5174,
    strictPort: false,
    host: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
