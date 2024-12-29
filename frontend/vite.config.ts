// import {defineConfig} from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()]
// })

import { defineConfig } from "vite";
// import tsconfigPaths from 'vite-tsconfig-paths'; // Optional plugin for tsconfig paths

export default defineConfig({
  server: {
    proxy: {
      "/config": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/config/, "/config"),
      },
      "/emotes": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/emotes/, "/emotes"),
      },
      "/background": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/background/, "/background"),
      },
    },
  },
  root: "./",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
  // plugins: [tsconfigPaths()]
});
