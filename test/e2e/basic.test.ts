import path from 'node:path';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { RouteRecordRaw } from 'vue-router';
import { createVirtualModuleCode, createVirtualModuleID } from '../../src/virtual.js';
import { baseDir, codeToModule, getRoutes, sanitizeRouteComponentPaths } from './utils';

describe('basic', () => {
  let routesContext: RouteRecordRaw[];

  beforeAll(async () => {
    const { routes } = await getRoutes();
    routesContext = routes;
  });

  it('should work', async () => {
    const code = await createVirtualModuleCode({
      target: path.join('fixtures', 'layouts'),
      defaultLayout: 'default',
      importMode: 'sync',
      wrapComponent: false,
      skipTopLevelRouteLayout: false,
    });

    // First verify the code is valid JavaScript
    let Layout;
    try {
      Layout = (await codeToModule(code, 'layout')) as typeof import('virtual:vue-layouts');
    } catch (error) {
      console.error('Code evaluation failed:');
      console.error(error);
      throw error;
    }

    expect(Layout).toBeDefined();
    // Rest of the test...
    const routes = Layout.setupLayouts(routesContext);
    expect(sanitizeRouteComponentPaths(routes)).toMatchSnapshot('Unwrapped routes');
    Layout.setupLayouts(routes);
  });

  const getWrappedRoutes = async (code: PromiseLike<string>) => {
    const Layout = (await codeToModule(await code, 'layout')) as typeof import('virtual:vue-layouts');
    const routes = Layout.setupLayouts(routesContext);
    const routesWrapped = Layout.setupLayouts(routes);
    return { routes, routesWrapped };
  };

  it('should work with async layouts', async () => {
    await getWrappedRoutes(
      createVirtualModuleCode({
        target: path.join('fixtures', 'layouts'),
        defaultLayout: 'default',
        importMode: 'async',
        wrapComponent: false,
        skipTopLevelRouteLayout: false,
      }),
    );
  });

  it('should work with async layouts and wrapComponent', async () => {
    await getWrappedRoutes(
      createVirtualModuleCode({
        target: path.join('fixtures', 'layouts'),
        defaultLayout: 'default',
        importMode: 'async',
        wrapComponent: true,
        skipTopLevelRouteLayout: false,
      }),
    );
  });

  it('should work with async layouts and skipTopLevelRouteLayout', async () => {
    await getWrappedRoutes(
      createVirtualModuleCode({
        target: path.join('fixtures', 'layouts'),
        defaultLayout: 'default',
        importMode: 'async',
        wrapComponent: false,
        skipTopLevelRouteLayout: true,
      }),
    );
  });

  it('should match snapshot with wrapComponent', async () => {
    const { routesWrapped } = await getWrappedRoutes(
      createVirtualModuleCode({
        target: path.join('fixtures', 'layouts'),
        defaultLayout: 'default',
        importMode: 'sync',
        wrapComponent: true,
        skipTopLevelRouteLayout: false,
      }),
    );
    expect(sanitizeRouteComponentPaths(routesWrapped)).toMatchSnapshot('Wrapped Component');
  });

  it('should match snapshot with route wrapping', async () => {
    const { routesWrapped } = await getWrappedRoutes(
      createVirtualModuleCode({
        target: path.join('fixtures', 'layouts'),
        defaultLayout: 'default',
        importMode: 'sync',
        wrapComponent: false,
        skipTopLevelRouteLayout: false,
      }),
    );
    expect(sanitizeRouteComponentPaths(routesWrapped)).toMatchSnapshot('Route Wrapping');
  });
});
