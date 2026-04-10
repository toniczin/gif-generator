import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const parentModules = path.resolve(__dirname, "../node_modules");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@composition": path.resolve(__dirname, "../src"),
      "remotion": path.resolve(parentModules, "remotion"),
      "@remotion/player": path.resolve(parentModules, "@remotion/player"),
      "@remotion/zod-types": path.resolve(parentModules, "@remotion/zod-types"),
      "react": path.resolve(parentModules, "react"),
      "react-dom": path.resolve(parentModules, "react-dom"),
    },
  },
  publicDir: path.resolve(__dirname, "../public"),
  server: {
    port: 3000,
  },
});
