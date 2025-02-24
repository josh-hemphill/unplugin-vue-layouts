import { normalizePath as normalizePathVite } from 'vite';

export function normalizePath(path: string) {
  path = path.startsWith('/') ? path : `/${path}`;
  return normalizePathVite(path);
}
