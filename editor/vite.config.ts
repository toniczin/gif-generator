import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const parentModules = path.resolve(__dirname, "../node_modules");
const editorModules = path.resolve(__dirname, "node_modules");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@composition", replacement: path.resolve(__dirname, "../src") },
      { find: /^remotion$/, replacement: path.resolve(parentModules, "remotion") },
      { find: /^remotion\/(.*)$/, replacement: path.resolve(parentModules, "remotion") + "/$1" },
      { find: /^@remotion\/player$/, replacement: path.resolve(parentModules, "@remotion/player") },
      { find: /^@remotion\/player\/(.*)$/, replacement: path.resolve(parentModules, "@remotion/player") + "/$1" },
      { find: /^@remotion\/zod-types$/, replacement: path.resolve(parentModules, "@remotion/zod-types") },
      { find: /^@remotion\/zod-types\/(.*)$/, replacement: path.resolve(parentModules, "@remotion/zod-types") + "/$1" },
      { find: /^zod$/, replacement: path.resolve(editorModules, "zod") },
      { find: /^zod\/(.*)$/, replacement: path.resolve(editorModules, "zod") + "/$1" },
    ],
    dedupe: ["react", "react-dom", "remotion", "@remotion/player", "zod"],
  },
  optimizeDeps: {
    include: ["zod", "@remotion/zod-types", "@remotion/player", "remotion"],
  },
  publicDir: path.resolve(__dirname, "../public"),
  server: {
    port: 3000,
    fs: {
      allow: [".."],
    },
  },
});
