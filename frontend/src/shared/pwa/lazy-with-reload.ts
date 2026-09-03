import type { ComponentType, LazyExoticComponent } from 'react';

import { lazy } from 'react';

import { importWithReload } from './deployment-recovery';

export function lazyWithReload<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(() => importWithReload(loader));
}
