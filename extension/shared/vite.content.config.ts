import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// This config is for building the content script as a separate IIFE bundle.
export default defineConfig(({ mode }) => {
  const browser = mode === "firefox" ? "firefox" : "chrome";

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: path.resolve(__dirname, `dist/${browser}`),
      // To prevent Vite from clearing the outDir from the main build
      emptyOutDir: false,
      rollupOptions: {
        input: {
          content: path.resolve(__dirname, "src/lib/content.ts"),
        },
        output: {
          format: "iife",
          entryFileNames: "content.js",
          // Since this is an IIFE, we don't need asset file hashing
          assetFileNames: "content.css",
        },
      },
    },
    // Add React and Tailwind support for the content script
    plugins: [react(), tailwindcss()],
  };
});
