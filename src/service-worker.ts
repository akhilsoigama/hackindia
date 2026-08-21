// src/service-worker.ts
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'rural-spark-v2';
const CHUNKS_CACHE_NAME = 'chunks-cache-v2';

// Install event - Cache all critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Cache static assets
      await cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
      ]);
      
      // ✅ Pre-cache all chunks from the build
      try {
        // Fetch the main bundle to get chunk references
        const response = await fetch('/index.html');
        const html = await response.text();
        
        // Extract all chunk URLs from HTML
        const chunkUrls = html.match(/\/assets\/[^"']+\.js/g) || [];
        const uniqueChunks = [...new Set(chunkUrls)];
        
        // Cache all chunks
        const chunkCache = await caches.open(CHUNKS_CACHE_NAME);
        await Promise.allSettled(
          uniqueChunks.map(url => 
            chunkCache.add(url).catch(() => {})
          )
        );
        
        console.log(`✅ Pre-cached ${uniqueChunks.length} chunks`);
      } catch (error) {
        console.warn('⚠️ Chunk pre-caching failed:', error);
      }
    })()
  );
  self.skipWaiting();
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== CHUNKS_CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })()
  );
  self.clients.claim();
});

// ✅ Fetch event with chunk handling
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API requests
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // ✅ Handle chunk requests
  if (url.pathname.includes('/assets/') && url.pathname.endsWith('.js')) {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          if (cached) {
            // ✅ Return cached chunk
            return cached;
          }
          
          // Try network with cache fallback
          return fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                // Cache the chunk for future
                const clone = response.clone();
                caches.open(CHUNKS_CACHE_NAME).then(cache => {
                  cache.put(event.request, clone);
                });
              }
              return response;
            })
            .catch(() => {
              // ✅ Offline fallback - Return empty script
              return new Response(
                'console.log("Chunk not available offline")',
                {
                  status: 200,
                  headers: { 
                    'Content-Type': 'application/javascript',
                    'Cache-Control': 'no-cache'
                  }
                }
              );
            });
        })
    );
    return;
  }
  
  // ✅ Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then((cached) => {
          if (cached) {
            // ✅ Return cached HTML
            return cached;
          }
          
          return fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, clone);
                });
              }
              return response;
            })
            .catch(() => {
              return new Response('You are offline', {
                status: 503,
                statusText: 'Service Unavailable',
              });
            });
        })
    );
    return;
  }
  
  // ✅ Default fetch
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        if (cached) return cached;
        
        return fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, clone);
              });
            }
            return response;
          })
          .catch(() => {
            // Offline fallback
            return new Response('Resource not available offline', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
  );
});