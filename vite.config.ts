import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(() => {

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      open: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "tests/setupTests",
      mockReset: true,
    },
  };
});