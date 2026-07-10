import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config — plain and minimal on purpose.
// The React plugin gives us Fast Refresh (instant hot-reload on save).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
