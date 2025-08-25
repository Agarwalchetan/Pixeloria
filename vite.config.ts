import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'fs';
import path from 'path';

// Plugin to copy _redirects file
const copyRedirectsPlugin = () => ({
  name: 'copy-redirects',
  writeBundle() {
    const src = path.resolve('public/_redirects');
    const dest = path.resolve('dist/_redirects');
    if (existsSync(src)) {
      copyFileSync(src, dest);
      console.log('✅ Copied _redirects file to dist/');
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyRedirectsPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 3000,
    historyApiFallback: true,
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
