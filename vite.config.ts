import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ يشير إلى مجلد src الحالي
      "@": path.resolve(__dirname, "./src"),
      // إذا نقلت مجلد assets داخل src استخدم هذا السطر
      "@assets": path.resolve(__dirname, "./src/assets"), 
    },
  },
  server: {
    host: true, // ضروري للتشغيل على بعض البيئات السحابية
    port: 3000, 
  }
});
