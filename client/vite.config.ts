import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
