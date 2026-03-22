import bcrypt from "bcryptjs";
import { testApp } from "..";
import { getAccessToken } from "../utils/common";
import drizzleMock from "../__mocks__/drizzle-mock";
import { mockExecutionCtx } from "../__mocks__/cloudflare-workers-mock";
import { User } from "../db/schema";

type ErrorResponse = {
  message: string;
};

const NEW_EMAIL = "updated@test.com";
const NEW_HOOK = "updated";
const NEW_PASSWORD = "Updated1234!";
const NEW_PASSWORD_HASH = bcrypt.hashSync(NEW_PASSWORD, 10);

const mockEnv = {
  WEBHOOK_SECRET: "test-secret",
  JWT_ACCESS_SECRET: "test-jwt-secret",
  JWT_REFRESH_SECRET: "test-jwt-refresh-secret",
  DB: {} as any,
  ENVIRONMENT: "test",
  GITLAB_REDIRECT_URI: "http://localhost:8080/oauth/gitlab/callback",
  DATABASE_URL: "test-db-url",
  GITLAB_APP_ID: "test-app-id",
  GITLAB_APP_SECRET: "test-app-secret",
} as Env;

const MOCK_USER: User = {
  id: "1",
  email: "test@test.com",
  password: bcrypt.hashSync("Test1234!", 10),
  createdAt: new Date(),
  updatedAt: new Date(),
  expoPushTokens: [],
  hookId: "test",
  lastLogin: new Date(Date.now() - 1000),
  onboardingCompleted: false,
  mutedUntil: null,
  gitlabId: null,
};

describe("GET /user", () => {
  it("Fails if unauthorized", async () => {
    const res = await testApp.request("/user", { method: "GET" }, mockEnv, mockExecutionCtx);
    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorResponse;
    expect(body.message).toBe("no authorization included in request");
  });
});

describe("PUT /user", () => {
  it("Fails if unauthorized", async () => {
    const res = await testApp.request(
      "/user",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
      mockEnv,
      mockExecutionCtx,
    );
    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorResponse;
    expect(body.message).toBe("no authorization included in request");
  });
  it("Updates user data", async () => {
    const mockUpdateReturning = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const mockUpdateWhere = vi.fn().mockReturnValue({
      returning: mockUpdateReturning,
    });
    const mockUpdateSet = vi.fn().mockReturnValue({
      where: mockUpdateWhere,
    });
    drizzleMock.update.mockReturnValue({
      set: mockUpdateSet,
    } as any);

    const res = await testApp.request(
      "/user",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + getAccessToken({ uid: "1" }, mockEnv.JWT_ACCESS_SECRET),
        },
        body: JSON.stringify({
          email: NEW_EMAIL,
          hookId: NEW_HOOK,
        }),
      },
      mockEnv,
      mockExecutionCtx,
    );
    expect(res.status).toBe(200);
    expect(drizzleMock.update).toHaveBeenCalled();
  });
  it("Updates user password", async () => {
    const mockUpdateReturning = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const mockUpdateWhere = vi.fn().mockReturnValue({
      returning: mockUpdateReturning,
    });
    const mockUpdateSet = vi.fn().mockReturnValue({
      where: mockUpdateWhere,
    });
    drizzleMock.update.mockReturnValue({
      set: mockUpdateSet,
    } as any);

    const res = await testApp.request(
      "/user",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + getAccessToken({ uid: "1" }, mockEnv.JWT_ACCESS_SECRET),
        },
        body: JSON.stringify({
          email: NEW_EMAIL,
          hookId: NEW_HOOK,
          password: NEW_PASSWORD,
        }),
      },
      mockEnv,
      mockExecutionCtx,
    );
    expect(res.status).toBe(200);
    expect(drizzleMock.update).toHaveBeenCalled();
  });
});

describe("DELETE /user", () => {
  it("Fails if unauthorized", async () => {
    const res = await testApp.request(
      "/user",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
      mockEnv,
      mockExecutionCtx,
    );
    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorResponse;
    expect(body.message).toBe("no authorization included in request");
  });

  it("Deletes user", async () => {
    const mockDeleteReturning = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const mockDeleteWhere = vi.fn().mockReturnValue({
      returning: mockDeleteReturning,
    });
    drizzleMock.delete.mockReturnValue({
      where: mockDeleteWhere,
    } as any);

    const res = await testApp.request(
      "/user",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + getAccessToken({ uid: "1" }, mockEnv.JWT_ACCESS_SECRET),
        },
      },
      mockEnv,
      mockExecutionCtx,
    );
    expect(res.status).toBe(200);
    expect(drizzleMock.delete).toHaveBeenCalled();
  });
});
