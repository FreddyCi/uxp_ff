import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";

export default defineConfig(({ mode }) => {
  const isUxp = mode === "uxp" || process.env.UXP_BUILD === "true";
  
  return {
    plugins: [
      react(),
      // Copy manifest for UXP builds
      isUxp && {
        name: "copy-manifest",
        writeBundle() {
          copyFileSync("src/uxp-manifest.json", "dist-uxp/manifest.json");
        }
      },
      // UXP HTML transformation plugin
      isUxp && {
        name: "uxp-html-transform",
        transformIndexHtml(html: string) {
          // Remove type="module" and crossorigin attributes for UXP compatibility
          return html
            .replace(/type="module"\s*/g, '')
            .replace(/crossorigin\s*/g, '')
            // Ensure script src points to the correct IIFE bundle
            .replace(/src="[^"]*\/src\/main\.tsx"/, 'src="./index.js"');
        }
      }
    ].filter(Boolean),

    // Use relative paths for UXP
    base: isUxp ? "./" : "/",

    build: {
      target: "es2019",
      sourcemap: true,
      outDir: isUxp ? "dist-uxp" : "dist",
      rollupOptions: isUxp
        ? { 
            output: { 
              format: "iife", 
              name: "PluginApp", 
              entryFileNames: "index.js",
              // Disable code splitting for cleaner UXP bundle
              manualChunks: undefined,
              inlineDynamicImports: true
            } 
          }
        : undefined,
    },

    // Define globals for UXP compatibility
    define: {
      global: 'globalThis',
      'process.env': {},
    },
  };
});