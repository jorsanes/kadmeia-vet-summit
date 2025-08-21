import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";
import { splitVendorChunkPlugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    mdx({
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'meta' }],
      ],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "append", properties: { className: ["mdx-anchor"] } }],
      ],
    }),
    react(),
    mode === "development" && componentTagger(),
    // Bundle analyzer - only in build mode
    command === "build" &&
      visualizer({
        filename: "dist/stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    // Precompresión
    compression({ algorithm: "brotliCompress", ext: ".br", deleteOriginFile: false }),
    compression({ algorithm: "gzip", ext: ".gz", deleteOriginFile: false }),
    splitVendorChunkPlugin(),
    // PWA
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,avif,woff2}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Imágenes estáticas
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 días
            },
          },
          {
            // CSS/JS
            urlPattern: ({ request }) =>
              request.destination === "style" || request.destination === "script" || request.destination === "worker",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "assets" },
          },
          {
            // Páginas HTML
            urlPattern: ({ request, url }) =>
              request.destination === "document" && url.pathname !== "/index.html",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 días
            },
          },
        ],
      },
      manifest: {
        name: "KADMEIA",
        short_name: "KADMEIA",
        description: "Consultoría y tecnología veterinaria que une evidencia, claridad e impacto.",
        theme_color: "#1E2A38",
        background_color: "#F5F1EA",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
        },
      },
    },
  },
}));
