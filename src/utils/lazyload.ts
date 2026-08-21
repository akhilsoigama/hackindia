// src/utils/lazyPreload.ts
import { lazy, ComponentType } from 'react';

// ✅ Store preload promises
const preloadPromises = new Map<string, Promise<any>>();

// ✅ Lazy load with preload
export function lazyPreload<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  chunkName?: string
) {
  // Create lazy component
  const LazyComponent = lazy(importFn);
  
  // ✅ Store preload function
  const preload = () => {
    if (!preloadPromises.has(chunkName || importFn.toString())) {
      const promise = importFn().catch(() => {});
      preloadPromises.set(chunkName || importFn.toString(), promise);
    }
    return preloadPromises.get(chunkName || importFn.toString());
  };
  
  // ✅ Attach preload to component
  (LazyComponent as any).preload = preload;
  
  return LazyComponent;
}

// ✅ Preload all chunks when idle
export const preloadAllChunks = (imports: Record<string, () => Promise<any>>) => {
  if (typeof window === 'undefined') return;
  
  const preload = () => {
    Object.values(imports).forEach((importFn) => {
      importFn().catch(() => {});
    });
  };
  
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preload, { timeout: 3000 });
  } else {
    setTimeout(preload, 500);
  }
};