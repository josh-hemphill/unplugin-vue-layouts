import { normalizePath } from './utils';
import type { Options } from './index';

export function createVirtualModuleID(name: string) {
  const virtualModuleId = `virtual:${name}`;
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;
  return {
    virtualModuleId,
    resolvedVirtualModuleId,
  };
}

export async function createVirtualGlob(target: string, isSync: boolean) {
  return `import.meta.glob("${target}/**/*.vue", { eager: ${isSync} })`;
}

type VirtualModuleCodeOptions = Required<Options>;

export async function createVirtualModuleCode(options: VirtualModuleCodeOptions) {
  const { target, defaultLayout, importMode, skipTopLevelRouteLayout, wrapComponent } = options;
  const normalizedTarget = normalizePath(target);
  const isSync = importMode === 'sync';

  const skipCode = /* ts */ `
    // unplugin-vue-router adds a top-level route to the routing group, which we should skip (ref: https://github.com/JohnCampionJr/vite-plugin-vue-layouts/issues/134)
    /** @type {boolean} */
    const skipLayout = top && !route.component && route.children?.find(r => (r.path === '' || r.path === '/') && r.meta?.isLayout)
    if (skipLayout) {
      return route
    }
  `;

  function createLayoutRoute() {
    return /* ts */ `
    // Create a new route with the layout as the component
    /** @type {import('vue-router').RouteRecordRaw} */
    const layoutRoute = {
      path: route.path,
      component: layouts[layout],
      meta: { ...route.meta, isLayout: true },
      // Handle root path specially to avoid infinite nesting
      children: top && route.path === '/' 
        ? [route] 
        : [{ ...route, path: '', meta: { ...route.meta, isLayout: false } }]
    }
    return layoutRoute
    `;
  }

  function createLayoutComponent() {
    return /* ts */ `
    if (!route.component) {
      return route
    }
    /** @type {import('vue-router').RouteRecordRaw} */
    const wrappedRoute = {
      ...route,
      component: h('div', [
        h(layouts[layout]),
        h(define${isSync ? '' : 'Async'}Component(() => route.component())),
      ]),
      meta: {
        ...route.meta,
        isLayout: true
      }
    }
    return wrappedRoute
    `;
  }

  function fixIndentation(code: string, indent: number) {
    return code.replace(/\n/g, `\n${' '.repeat(indent)}`);
  }

  const importStatements = [wrapComponent ? `import { h, define${isSync ? '' : 'Async'}Component } from 'vue'` : '']
    .filter(Boolean)
    .join('\n');

  return /* ts */ `
    ${importStatements}

    /**
     * @param {Router} router
     * @param {boolean} [withLayout=false]
     * @returns {import('vue-router').RouteRecordRaw[] | (() => import('vue-router').RouteRecordRaw[])}
     */
    export function createGetRoutes(router, withLayout = false) {
      const routes = router.getRoutes()
      if (withLayout) {
        return routes
      }
      return () => routes.filter(route => !route.meta?.isLayout)
    }

    /**
     * @param {import('vue-router').RouteRecordRaw[]} routes
     * @returns {import('vue-router').RouteRecordRaw[]}
     */
    export function setupLayouts(routes) {
      /** @type {Record<string, any>} */
      const layouts = {}

      const modules = ${await createVirtualGlob(normalizedTarget, isSync)}

      Object.entries(modules).forEach(([name, module]) => {
        let key = name.replace("${normalizedTarget}/", '').replace('.vue', '')
        layouts[key] = ${isSync ? 'module.default' : 'module'}
      })

      /**
       * @param {import('vue-router').RouteRecordRaw[]} lRoutes
       * @param {boolean} [top=true]
       * @returns {import('vue-router').RouteRecordRaw[]}
       */
      function deepSetupLayout(lRoutes, top = true) {
        return lRoutes.map(route => {
          // Process children first
          if (route.children?.length > 0) {
            route.children = deepSetupLayout(route.children, false)
          }

          // Skip if already processed
          if (route.meta?.isLayout) {
            return route
          }

          const layout = route.meta?.layout ?? '${defaultLayout}'

          ${fixIndentation(skipTopLevelRouteLayout ? skipCode : '', 6)}
          
          if (layout && layouts[layout]) {
            ${fixIndentation(wrapComponent ? createLayoutComponent() : createLayoutRoute(), 8)}
          }

          return route
        })
      }

      return deepSetupLayout(routes)
    }
  `;
}
