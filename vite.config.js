import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    server: {
      allowedHosts: ["445e-220-133-182-86.ngrok-free.app"],
    },
    base: mode === "production" ? "/furry_friend-react/" : "/",
    plugins: [react()],
  };
});
