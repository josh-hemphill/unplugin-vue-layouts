import { type ViteUserConfig, defineConfig, mergeConfig } from 'vitest/config';
import VueLayouts, { type Options } from 'unplugin-vue-layouts';
import VueRouter from 'unplugin-vue-router/vite';
import vue from '@vitejs/plugin-vue';

const getBasePlugins = (opts: Partial<Options> = {}) => [
  VueRouter({
    dts: false,
    /* importMode: 'sync',
    root: baseDir, */
    routesFolder: 'test/e2e/fixtures/pages',
  }),
  vue(),
  VueLayouts({
    target: 'test/e2e/fixtures/layouts',
    defaultLayout: 'default',
    importMode: 'sync',
    wrapComponent: false,
    skipTopLevelRouteLayout: false,
    ...opts,
  }),
];

const testCases = [
  { name: 'async', opts: { importMode: 'async' } },
  { name: 'async-wrap-component', opts: { importMode: 'async', wrapComponent: true } },
  { name: 'async-skip-top-level-route-layout', opts: { importMode: 'async', skipTopLevelRouteLayout: true } },
  { name: 'wrap-component', opts: { wrapComponent: true } },
  { name: 'wrap-route', opts: {} },
] satisfies { name: string; opts: Partial<Options> }[];

// Base configuration that's common across all test runs
export default defineConfig({
  test: {
    workspace: testCases.map((testCase) => ({
      extends: true,
      plugins: getBasePlugins(testCase.opts),
      test: {
        name: testCase.name,
        provide: {
          runName: testCase.name,
        },
      },
    })),
    environment: 'happy-dom',
    include: ['test/e2e/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/generated/**', '**/__snapshots__/**'],
    isolate: false,
  },
  publicDir: false,
});
