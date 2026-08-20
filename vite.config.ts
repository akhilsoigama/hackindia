import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        name: 'Nabha Learn',
        short_name: 'Nabha Learn',
        description: 'Learning Management System',
        theme_color: '#ffffff',
        start_url: '/dashboard', // Added to align PWA with redirect
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/(?!api).*$/], // Allow all routes except /api
        runtimeCaching: [
          {
            urlPattern: /^\/$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nabha-learn-root',
              cacheableResponse: { statuses: [0, 200, 301] }, // Allow redirects
            },
          },
          {
            urlPattern: /^\/dashboard.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nabha-learn-dashboard',
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(?:js|css|html|svg|png|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nabha-learn-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/(?!api).*$/], // Adjusted for testing
        suppressWarnings: true,
        type: 'module',
      },
    }),
    tailwindcss(),
  ],
  //  server: {
  //   headers: {
  //     'Cross-Origin-Opener-Policy': 'same-origin',
  //     'Cross-Origin-Embedder-Policy': 'require-corp',
  //   },
  // },
});