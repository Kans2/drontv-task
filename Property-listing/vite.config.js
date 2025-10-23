import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: parseInt(process.env.PORT) || 5173,
    proxy: {
      '/api': 'http://localhost:5000', // local backend JSON server
    },
  },
});
