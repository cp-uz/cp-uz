import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 8081;

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: {
      app: path.resolve(process.cwd(), 'src/app'),
      modules: path.resolve(process.cwd(), 'src/modules'),
      shared: path.resolve(process.cwd(), 'src/shared'),
      src: path.resolve(process.cwd(), 'src'),
    },
  },
  server: {
    port: PORT,
    host: true,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/media': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
  preview: { port: PORT, host: true },
  build: { manifest: true },
});
