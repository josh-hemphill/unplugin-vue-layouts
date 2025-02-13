import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueRouter from 'unplugin-vue-router/vite';

export default defineConfig({
  plugins: [vueRouter({ dts: false }), vue()],
  test: {
    environment: 'happy-dom',
    include: ['basic.test.ts'],
    exclude: ['node_modules', 'dist', 'generated', '__snapshots__'],
  },
});
