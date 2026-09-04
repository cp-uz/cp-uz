import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      app: fileURLToPath(new URL('./src/app', import.meta.url)),
      modules: fileURLToPath(new URL('./src/modules', import.meta.url)),
      shared: fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['scripts/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    clearMocks: true,
  },
});
