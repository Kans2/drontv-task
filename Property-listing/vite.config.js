import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow network access
    port: 5173, // optional
    allowedHosts: ["drontv-task-1.onrender.com"], // ✅ allow this host
  },
});
