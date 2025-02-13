import { describe, expect, it } from 'vitest';
import { createVirtualGlob, createVirtualModuleCode, createVirtualModuleID } from '../../src/virtual';

describe('virtual module utilities', () => {
  it('creates virtual glob', async () => {
    const syncGlob = await createVirtualGlob('./layouts', true);
    const asyncGlob = await createVirtualGlob('./layouts', false);

    expect(syncGlob).toBe('import.meta.glob("./layouts/**/*.vue", { eager: true })');
    expect(asyncGlob).toBe('import.meta.glob("./layouts/**/*.vue", { eager: false })');
  });
});

describe('createVirtualModuleCode', () => {
  it('generates code with default layout', async () => {
    const code = await createVirtualModuleCode({
      target: './layouts',
      defaultLayout: 'default',
      importMode: 'sync',
      skipTopLevelRouteLayout: false,
      wrapComponent: false,
    });

    expect(code).toMatchSnapshot();
  });

  it('generates code with wrapped components', async () => {
    const code = await createVirtualModuleCode({
      target: './layouts',
      defaultLayout: 'default',
      importMode: 'async',
      skipTopLevelRouteLayout: false,
      wrapComponent: true,
    });

    expect(code).toMatchSnapshot();
  });

  it('generates code with top level route layout skipping', async () => {
    const code = await createVirtualModuleCode({
      target: './layouts',
      defaultLayout: 'default',
      importMode: 'sync',
      skipTopLevelRouteLayout: true,
      wrapComponent: false,
    });

    expect(code).toMatchSnapshot();
  });
});
