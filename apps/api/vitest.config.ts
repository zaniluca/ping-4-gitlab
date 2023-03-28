import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    setupFiles: ["./prisma/mocked-client.ts"],
    silent: true,
    globals: true,
  },
});
