import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    fileParallelism: false,
    open: false,
    workspace: [
      'test/e2e',
      {
        extends: true,
        test: {
          include: ['test/unit/**/*'],
          exclude: ['**/node_modules/**', '**/dist/**', '**/generated/**', '**/__snapshots__/**'],
        },
      },
    ],
  },
});
