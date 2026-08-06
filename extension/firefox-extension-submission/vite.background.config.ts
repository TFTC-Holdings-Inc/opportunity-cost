import { defineConfig } from "vite";
import path from "path";

// This config is for building the background script as a separate IIFE bundle for Firefox.
export default defineConfig(({ mode }) => {
  const browser = mode === "firefox" ? "firefox" : "chrome";

  return {
    build: {
      outDir: path.resolve(import.meta.dirname, `dist/${browser}`),
      // To prevent Vite from clearing the outDir from the main build
      emptyOutDir: false,
      rollupOptions: {
        input: {
          background: path.resolve(import.meta.dirname, "src/lib/background.ts"),
        },
        output: {
          format: "iife",
          entryFileNames: "background.js",
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
        },
      },
    },
    // We don't need plugins like react here for the background script
    plugins: [],
  };
});
