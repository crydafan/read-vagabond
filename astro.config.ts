// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://readbagabondo.com",

  output: "static",

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ["@libsql/client"],
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
