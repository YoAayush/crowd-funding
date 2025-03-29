import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    target: 'es2020', // Ensure Vite supports BigInt
    commonjsOptions: {
      include: [/node_modules/], // Force transpiling node_modules
    }
  },
  optimizeDeps: {
    include: ['viem'], // Include viem for proper transpilation
    esbuildOptions: {
      target: 'es2020', // Ensure BigInt support
    },
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
});