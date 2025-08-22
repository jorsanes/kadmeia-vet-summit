import { defineConfig, type PluginOption } from "vite";
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
export default defineConfig(({ mode, command }) => {
  const plugins: any[] = [
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ],
    }),
    react(),
    splitVendorChunkPlugin(),
    compression({ algorithm: "brotliCompress", ext: ".br", deleteOriginFile: false }),
    compression({ algorithm: "gzip", ext: ".gz", deleteOriginFile: false }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,avif,woff2}"],
        navigateFallback: "/index.html",
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB limit
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
  ];

  // Agregar plugins de desarrollo
  if (mode === "development") {
    plugins.push(componentTagger());
  }

  // Agregar bundle analyzer
  if (command === "build" || mode === "analyze") {
    plugins.push(
      visualizer({
        filename: mode === "analyze" ? "dist/bundle-analysis.html" : "dist/stats.html",
        open: mode === "analyze",
        gzipSize: true,
        brotliSize: true,
        template: "treemap", // Mejor visualización para análisis
      })
    );
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        buffer: "buffer",
      },
    },
    define: {
      global: 'globalThis',
      'process.env': {},
    },
    optimizeDeps: {
      include: ['buffer', 'gray-matter']
    },
    build: {
      sourcemap: mode === "analyze",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
            utils: ["clsx", "tailwind-merge", "class-variance-authority"],
            router: ["react-router-dom"],
            mdx: ["@mdx-js/react", "remark-gfm"],
          },
        },
      },
    },
  };
});