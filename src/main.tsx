// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Suspense, lazy } from 'react';
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

import { SWRConfig } from 'swr'
import { fetcher } from './utils/axios'

import { registerSW } from 'virtual:pwa-register'
import { ThemeProvider } from './theme/ThemeProvider'
import reportWebVitals from './reportWebVitals'
import { browserCache } from '@/utils/browser-cache'

const LazyToaster = lazy(() => import('./Toaster'));
const enablePwaRuntime = import.meta.env.PROD;

// ✅ Clear service worker in development mode to avoid localhost caching issues
if (import.meta.env.DEV && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('🗑️ Unregistered service worker in development mode');
          window.location.reload();
        }
      });
    }
  });
}

// ✅ Check if running as PWA
const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

// ✅ Chunk preload manager
const ChunkPreloader = {
  loadedChunks: new Set<string>(),
  
  preloadAllChunks() {
    if (typeof document === 'undefined') return;
    
    // ✅ If PWA, let service worker handle it
    if (isPWA()) {
      console.log('📱 PWA mode: Service Worker handles chunks');
      return;
    }
    
    // ✅ Browser mode: Use browser cache
    console.log('🌐 Browser mode: Using browser cache');
    
    const scripts = document.querySelectorAll('script[src]');
    const chunkUrls = Array.from(scripts)
      .map(script => script.getAttribute('src'))
      .filter((src): src is string => 
        src !== null && 
        src.includes('/assets/') && 
        src.endsWith('.js') &&
        !this.loadedChunks.has(src)
      );
    
    chunkUrls.forEach(url => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = url;
        document.head.appendChild(link);
        
        // ✅ Fetch to cache
        fetch(url, { mode: 'no-cors' }).catch(() => {});
        this.loadedChunks.add(url);
      } catch (e) {
        // Ignore errors
      }
    });
    
    if (chunkUrls.length > 0) {
      console.log(`✅ Preloaded ${chunkUrls.length} chunks in browser`);
    }
  },
  
  preloadWhenIdle() {
    if (isPWA()) return;
    
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => this.preloadAllChunks(), { timeout: 2000 });
    } else {
      setTimeout(() => this.preloadAllChunks(), 500);
    }
  }
};

// ✅ Service Worker Registration
const scheduleServiceWorkerRegistration = () => {
  if (!enablePwaRuntime) return;

  const register = () => {
    try {
      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          import('sonner').then(({ toast }) => {
            toast.info('New version available!', {
              description: 'Click to update the application',
              action: {
                label: 'Update',
                onClick: () => updateSW(true)
              },
              duration: 5000,
              dismissible: true
            });
          }).catch(() => {
            console.log('🔄 New version available. Please refresh.');
          });
        },
        onOfflineReady() {
          import('sonner').then(({ toast }) => {
            toast.success('App ready to work offline 🚀', {
              duration: 3000
            });
          }).catch(() => {
            console.log('✅ App ready to work offline');
          });
          
          setTimeout(() => ChunkPreloader.preloadAllChunks(), 500);
        },
        onRegisteredSW(swUrl, registration) {
          console.log('✅ Service Worker registered at:', swUrl);
          setTimeout(() => ChunkPreloader.preloadAllChunks(), 1000);
          
          if (registration) {
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);
          }
        },
        onRegisterError(error) {
          console.warn('⚠️ Service Worker registration error:', error);
          
          if (!isPWA()) {
            setTimeout(() => {
              browserCache.cacheAllChunks();
              browserCache.preloadChunks();
              ChunkPreloader.preloadAllChunks();
            }, 500);
          }
        }
      });
    } catch (error) {
      console.warn('⚠️ SW registration failed:', error);
      
      if (!isPWA()) {
        setTimeout(() => {
          browserCache.cacheAllChunks();
          browserCache.preloadChunks();
          ChunkPreloader.preloadAllChunks();
        }, 500);
      }
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(register, { timeout: 1500 });
    return;
  }

  setTimeout(register, 1200);
};

// ✅ Register Service Worker
if (enablePwaRuntime && 'serviceWorker' in navigator) {
  if (document.readyState === 'complete') {
    scheduleServiceWorkerRegistration();
  } else {
    window.addEventListener('load', scheduleServiceWorkerRegistration, { once: true });
  }
}

if (enablePwaRuntime && typeof window !== 'undefined') {
  if (!isPWA()) {
    // Preload on page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        browserCache.cacheAllChunks();
        browserCache.preloadChunks();
        ChunkPreloader.preloadAllChunks();
      }, 100);
    });
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        ChunkPreloader.preloadWhenIdle();
      }
    });
    
    // Preload when online
    window.addEventListener('online', () => {
      setTimeout(() => {
        browserCache.cacheAllChunks();
        browserCache.preloadChunks();
        ChunkPreloader.preloadAllChunks();
      }, 500);
    });
  } 
}

reportWebVitals(() => {});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SWRConfig value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        focusThrottleInterval: 30_000,
        dedupingInterval: 8_000,
        keepPreviousData: true,
        shouldRetryOnError: true,
        errorRetryCount: 2,
      }}>
        <ThemeProvider>
          <>
            <Suspense fallback={null}>
              <LazyToaster
                position="top-right"
                richColors
                theme="light"
                toastOptions={{
                  style: {
                    fontSize: '1rem',
                    letterSpacing: '0.01em',
                  },
                  className: 'shadow-lg',
                  duration: 3500,
                }}
              />
            </Suspense>
            <App />
          </>
        </ThemeProvider>
      </SWRConfig>
    </BrowserRouter>
  </React.StrictMode>,
);