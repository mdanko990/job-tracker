import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    globals: true,
    // Only pick up unit/component tests
    include: ["**/*.test.{ts,tsx}"],
    // Ignore Playwright directories and node_modules
    exclude: ["**/e2e/**", "**/node_modules/**", "**/dist/**"],
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
