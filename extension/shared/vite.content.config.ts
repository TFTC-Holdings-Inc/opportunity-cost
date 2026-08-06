import { defineConfig } from "vite";
import path from "path";

// This config is for building the content script as a separate IIFE bundle.
export default defineConfig(({ mode }) => {
  const browser = mode === "firefox" ? "firefox" : "chrome";

  return {
    build: {
      outDir: path.resolve(import.meta.dirname, `dist/${browser}`),
      // To prevent Vite from clearing the outDir from the main build
      emptyOutDir: false,
      rollupOptions: {
        input: {
          content: path.resolve(import.meta.dirname, "src/lib/content.ts"),
        },
        output: {
          format: "iife",
          entryFileNames: "content.js",
          // Since this is an IIFE, we don't need asset file hashing
          assetFileNames: "content.css",
        },
      },
    },
    // We don't need plugins like react here for the content script
    plugins: [],
  };
});
