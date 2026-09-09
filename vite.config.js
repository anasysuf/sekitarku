import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Mengizinkan akses dari HP di jaringan yang sama
    port: 3000
  }
});
