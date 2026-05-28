// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://readbagabondo.com",

  // Enable SSR for all pages
  output: "server",

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Optimize chunk size for better caching
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
