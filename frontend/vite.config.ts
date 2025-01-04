// import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()]
// })

import { title } from "process";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
// import tsconfigPaths from 'vite-tsconfig-paths'; // Optional plugin for tsconfig paths

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      entry: "src/main.tsx",
      inject: {
        data: {
          title: "main",
          injectScript: `<script type="module" src="/assets/main.[hash].js"></script>`,
        },
      },
    }),
  ],

  server: {
    proxy: {
      // "/": {
      //   target: "http://localhost:8080",
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
      "/emotes": {
        target: "http://localhost:3124",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/emotes/, "/emotes"),
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
    // assetsDir: "assets",
    // emptyOutDir: true,
    // manifest: true,
    // rollupOptions: {
    //   input: {
    //     main: "index.html",
    //   },

    // output: {
    //   entryFileNames: `assets/[name]-[hash].js`,
    //   chunkFileNames: `assets/[name]-[hash].js`,
    //   assetFileNames: `assets/[name]-[hash].[ext]`,
    // },
    // },
  },
  // plugins: [tsconfigPaths()]
});
function htmlPlugin(arg0: {
  minify: boolean;
  inject: { injectScript: any };
}): import("vite").PluginOption {
  throw new Error("Function not implemented.");
}
