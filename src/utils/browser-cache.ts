// src/utils/browserCache.ts
export class BrowserCacheManager {
  private cacheName = 'app-cache-v1';
  private isSupported = 'caches' in window;
  private cachedUrls = new Set<string>();

  // ✅ Check if running as PWA
  isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  }

  // ✅ Cache all chunks
  async cacheAllChunks(): Promise<void> {
    if (!this.isSupported || this.isPWA()) return;

    try {
      const cache = await caches.open(this.cacheName);
      
      // Get all script tags
      const scripts = document.querySelectorAll('script[src]');
      const chunkUrls = Array.from(scripts)
        .map(script => script.getAttribute('src'))
        .filter((src): src is string => 
          src !== null && 
          src.includes('/assets/') && 
          src.endsWith('.js') &&
          !this.cachedUrls.has(src)
        );

      if (chunkUrls.length === 0) return;

      // Cache each chunk
      await Promise.allSettled(
        chunkUrls.map(async (url) => {
          try {
            const response = await fetch(url, { 
              mode: 'no-cors',
              cache: 'force-cache'
            });
            if (response.ok || response.type === 'opaque') {
              await cache.put(url, response);
              this.cachedUrls.add(url);
              console.log('✅ Cached chunk:', url.split('/').pop());
            }
          } catch (error) {
            console.warn('⚠️ Failed to cache chunk:', url.split('/').pop());
          }
        })
      );

      console.log(`✅ Cached ${chunkUrls.length} chunks in browser`);
    } catch (error) {
      console.warn('⚠️ Browser caching failed:', error);
    }
  }

  // ✅ Preload chunks using link preload
  preloadChunks(): void {
    if (this.isPWA()) return;

    const scripts = document.querySelectorAll('script[src]');
    const chunkUrls = Array.from(scripts)
      .map(script => script.getAttribute('src'))
      .filter((src): src is string => 
        src !== null && 
        src.includes('/assets/') && 
        src.endsWith('.js') &&
        !this.cachedUrls.has(src)
      );

    // Use link preload
    chunkUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = url;
      document.head.appendChild(link);
      
      // Also fetch to warm cache
      fetch(url, { mode: 'no-cors' }).catch(() => {});
      this.cachedUrls.add(url);
    });

    if (chunkUrls.length > 0) {
      console.log(`✅ Preloaded ${chunkUrls.length} chunks in browser`);
    }
  }

  // ✅ Get chunk from cache
  async getCachedChunk(url: string): Promise<Response | null> {
    if (!this.isSupported) return null;

    try {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(url);
      return response || null;
    } catch {
      return null;
    }
  }
}

export const browserCache = new BrowserCacheManager();