import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => {
  const isFirefox = mode === "firefox";
  const browser = isFirefox ? "firefox" : "chrome";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input: any = {
    main: path.resolve(__dirname, "index.html"),
    options: path.resolve(__dirname, "options.html"),
  };

  if (!isFirefox) {
    input.background = path.resolve(__dirname, "src/lib/background.ts");
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      viteStaticCopy({
        targets: [
          { src: `../${browser}/manifest.json`, dest: "." },
          { src: "public/icons", dest: "." },
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: `dist/${browser}`,
      emptyOutDir: process.env.WATCH ? false : true,
      rollupOptions: {
        input,
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === "background" ? "[name].js" : "assets/[name].js";
          },
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },
  };
});
