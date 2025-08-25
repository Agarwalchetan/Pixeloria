import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
    // Add SPA fallback for preview mode
    open: true,
    strictPort: false,
  },
  // Add SPA fallback configuration
  appType: 'spa',
});
