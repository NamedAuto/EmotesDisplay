import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // "/": {
      //   target: "http://localhost:3124",
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/$/, ""),
      // },
      "/config": {
        target: "http://localhost:3124",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/config/, "/config"),
      },
      "/icons": {
        target: "http://localhost:3124",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/icons/, "/icons"),
      },
      "/channel-emotes": {
        target: "http://localhost:3124",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/channel-emotes/, "/channel-emotes"),
      },
      "/random-emotes": {
        target: "http://localhost:3124",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/random-emotes/, "/random-emotes"),
      },
      "/background": {
        target: "http://localhost:3124",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/background/, "/background"),
      },
    },
  },
  root: "./",
  build: {
    outDir: "./dist",
  },
});
