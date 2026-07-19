import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const sdsSrc = path.resolve(__dirname, "../sds/src");

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      compositions: path.resolve(sdsSrc, "ui/compositions"),
      data: path.resolve(sdsSrc, "data"),
      hooks: path.resolve(sdsSrc, "ui/hooks"),
      icons: path.resolve(sdsSrc, "ui/icons"),
      images: path.resolve(sdsSrc, "ui/images"),
      layout: path.resolve(sdsSrc, "ui/layout"),
      primitives: path.resolve(sdsSrc, "ui/primitives"),
      utils: path.resolve(sdsSrc, "ui/utils"),
      "@demo": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8100,
  },
});
