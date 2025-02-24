import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    open: false,
    include: ['test/unit/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/generated/**', '**/__snapshots__/**'],
  },
});
