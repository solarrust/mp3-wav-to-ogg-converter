import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    reporters: ["default", "html"],
    setupFiles: ["./setupTests.js"],
  },
});
