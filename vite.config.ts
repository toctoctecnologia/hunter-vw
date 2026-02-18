import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { existsSync } from "fs";
import { componentTagger } from "lovable-tagger";

const pakoCandidates = [
  path.resolve(__dirname, "./node_modules/pako/lib/zlib"),
  path.resolve(__dirname, "./node_modules/browserify-zlib/node_modules/pako/lib/zlib"),
];

const pakoZlibBase = pakoCandidates.find((candidate) => existsSync(path.join(candidate, "zstream.js")));

const pakoAliases = pakoZlibBase
  ? {
      "pako/lib/zlib/zstream.js": path.join(pakoZlibBase, "zstream.js"),
      "pako/lib/zlib/deflate.js": path.join(pakoZlibBase, "deflate.js"),
      "pako/lib/zlib/inflate.js": path.join(pakoZlibBase, "inflate.js"),
      "pako/lib/zlib/constants.js": path.join(pakoZlibBase, "constants.js"),
    }
  : {};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use an absolute base path so built assets are resolved correctly from any route
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...pakoAliases,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
}));
