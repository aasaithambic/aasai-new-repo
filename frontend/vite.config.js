import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // In development, forward /api calls to the local Express server.
    // In production on Vercel, vercel.json routes /api to the backend.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
