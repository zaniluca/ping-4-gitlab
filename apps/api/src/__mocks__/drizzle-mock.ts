import type { DrizzleClient } from "../db/client";
import { DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";

const drizzleMock = mockDeep<DrizzleClient>();

vi.mock("../db/client", () => ({
  getDrizzleClient: vi.fn(() => drizzleMock),
}));

beforeEach(() => {
  mockReset(drizzleMock);
});

export default drizzleMock as DeepMockProxy<DrizzleClient>;
