import type { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";

import prisma from "./client";

vi.mock("./client", () => ({
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

export default prismaMock;
