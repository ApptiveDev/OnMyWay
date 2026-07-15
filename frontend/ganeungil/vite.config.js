import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@api": resolve(__dirname, "api"),
      "@context": resolve(__dirname, "context")
    },
  },
  server: {
    host: true,
    proxy: {
      "/api/auth": "http://localhost:8080",
      "/api/users": "http://localhost:8080",
      "/api/place": "http://localhost:8080",
      "/oauth2": "http://localhost:8080",
      "/login/oauth2": "http://localhost:8080",
      "/places": "http://localhost:8080",
      "/route": "http://localhost:8080",
    },
  },
});
