import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain (tourhubmongolia.com): base = '/'
// buldruu.github.io/tourhubmongolia/ дээр ажиллуулах бол: base = '/tourhubmongolia/'
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});
