import { vi } from "vitest";

// Mock the cloudflare:workers module
vi.mock("cloudflare:workers", () => ({
  env: {
    ENVIRONMENT: "test",
    EXPO_ACCESS_TOKEN: "test-expo-token",
  },
}));

export const mockExecutionCtx = {
  waitUntil: vi.fn(),
  passThroughOnException: vi.fn(),
} as unknown as ExecutionContext;
