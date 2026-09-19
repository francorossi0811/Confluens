import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Un único .env en la raíz del monorepo; Vite solo expone las variables con prefijo VITE_.
  envDir: '../..',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // En desarrollo las llamadas a /api se redirigen a la API local (evita CORS).
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
