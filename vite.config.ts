import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

function pruneRawImagesPlugin(): Plugin {
  return {
    name: "prune-raw-images",
    closeBundle() {
      const clientImages = path.resolve(__dirname, "build/client/images");
      if (fs.existsSync(clientImages)) {
        fs.rmSync(clientImages, { recursive: true, force: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
    tailwindcss(),
    reactRouter(),
    pruneRawImagesPlugin(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

