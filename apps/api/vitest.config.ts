import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    setupFiles: [
      "./src/__mocks__/drizzle-mock.ts",
      "./src/__mocks__/axios-mock.ts",
      "./src/__mocks__/cloudflare-workers-mock.ts",
    ],
    silent: true,
    globals: true,
  },
});
