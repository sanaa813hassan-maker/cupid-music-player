import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: 'audio',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    headers: {
      // Allow this app to be embedded as an <iframe> on any origin.
      // Remove or tighten this in production if you want to restrict
      // which sites can embed the player.
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors *",
    },
  },
  preview: {
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors *",
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
