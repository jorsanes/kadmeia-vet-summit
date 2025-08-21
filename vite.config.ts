// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { visualizer } from "rollup-plugin-visualizer";
import compression from 'vite-plugin-compression';
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const isDev = mode === "development" && command === "serve";
  const isAnalyze = mode === "analyze" && command === "build";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      // MDX primero para que transforme antes que React
      mdx({
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'append', properties: { className: ['mdx-anchor'] } }]
        ],
      }),
      react(),
      // Solo en dev local (Lovable/preview) añade el tagger
      isDev && componentTagger(),
      // Analizador del bundle SOLO cuando `mode=analyze`
      isAnalyze &&
        visualizer({
          filename: "dist/stats.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
          open: true,
        }),
      // Compresión para build de producción
      !isDev && compression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false }),
      !isDev && compression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false }),
      !isDev && splitVendorChunkPlugin()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Mapa de fuentes solo cuando analizas para que el treemap sea útil
      sourcemap: isAnalyze,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: [
              "@radix-ui/react-accordion",
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
            ],
            utils: ["clsx", "tailwind-merge", "class-variance-authority"],
          },
        },
      },
    },
  };
});
