// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-ffmpeg-core",
      apply: "build",
      buildStart() {
        const srcDir = path.resolve("node_modules/@ffmpeg/core/dist");
        const destDir = path.resolve("public/ffmpeg");
        const files = [
          "ffmpeg-core.js",
          "ffmpeg-core.wasm",
          "ffmpeg-core.worker.js",
        ];
        if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
        files.forEach((file) => {
          const src = path.join(srcDir, file);
          const dest = path.join(destDir, file);
          if (existsSync(src)) copyFileSync(src, dest);
        });
      },
    },
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "RuralSpark",
        short_name: "RuralSpark",
        description: "Learning Management System",
        theme_color: "#ffffff",
        scope: "/",
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,svg,png,ico,wasm,mp4,webmanifest,json,woff,woff2}",
        ],
        globIgnores: ["**/node_modules/**/*", "**/.*"],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) => {
              return (
                request.destination === "script" ||
                url.pathname.match(/\/assets\/.*\.js$/)
              );
            },
            handler: "CacheFirst",
            options: {
              cacheName: "chunks-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-pages",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(css)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "css-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
        type: "module",
        navigateFallback: "index.html",
      },
    }),
  ],

  server: {
    headers:
      command === "serve"
        ? {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "credentialless",
          }
        : {},
  },

  preview: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },

  build: {
    outDir: "dist",
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    assetsDir: "assets",
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@mui/material", "@mui/icons-material"],
          ffmpeg: ["@ffmpeg/ffmpeg", "@ffmpeg/core"],
          idb: ["idb"],
          utils: ["axios", "date-fns"],
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 2000,
  },

  optimizeDeps: {
    include: [
      "@ffmpeg/ffmpeg",
      "browser-image-compression",
      "idb",
      "react",
      "react-dom",
      "react-router-dom",
      "jotai",
      "jotai/utils",
    ],
    exclude: ["@ffmpeg/core"],
  },

  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      ws: path.resolve(__dirname, "empty-module.js"),
    },
  },
}));
