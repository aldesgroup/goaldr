import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // shipping our type definitions
    dts({ include: ["lib"] }),
    // making sure our exported JS imports the corresponding CSS
    libInjectCss(),
  ],
  build: {
    // Vite's mode for libraries
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
    // don't need the public dir for now
    copyPublicDir: false,
    rollupOptions: {
      // this library will be used in projects that have React installed anyways
      external: ["react", "react/jsx-runtime", "@tanstack/react-router"],
      input: Object.fromEntries(
        glob.sync("lib/**/*.{ts,tsx}").map((file) => [
          // The name of the entry point
          // lib/nested/foo.ts becomes nested/foo
          relative("lib", file.slice(0, file.length - extname(file).length)),
          // The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url)),
        ])
      ),
      // splitting the CSS & JS into assets & entries
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
