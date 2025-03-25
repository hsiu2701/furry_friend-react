import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["445e-220-133-182-86.ngrok-free.app"],
  },
  base: process.env.NODE_ENV === "production" ? "/furry_friend-react/" : "/",
  plugins: [react()],
});
