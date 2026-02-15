import bcrypt from "bcryptjs";
import { testApp } from "..";
import { getAccessToken, getRefreshToken } from "../utils/common";
import { User } from "../db/schema";
import drizzleMock from "../__mocks__/drizzle-mock";

type ErrorResponse = {
  message: string;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

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

const INVALID_REFRESH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.p7ngO132vgfaib2y-FZ81_nugwqDtI8YS96Y_0Xdom8";

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

describe("POST /login", () => {
  it("Fails if required fields aren't provided", async () => {
    const res = await testApp.request(
      "/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
      mockEnv,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as ErrorResponse;
    expect(body.message).toBeDefined();
  });
  it("Fails if credentials are invalid", async () => {
    const mockWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(null),
    });
    const mockFrom = vi.fn().mockReturnValue({
      where: mockWhere,
    });
    drizzleMock.select.mockReturnValue({
      from: mockFrom,
    } as any);

    const res1 = await testApp.request(
      "/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nottest@test.com",
          password: "wrongpassword",
        }),
      },
      mockEnv,
    );
    expect(res1.status).toBe(401);
    const body1 = (await res1.json()) as ErrorResponse;
    expect(body1.message).toBe("Invalid credentials");

    const mockWhere2 = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const mockFrom2 = vi.fn().mockReturnValue({
      where: mockWhere2,
    });
    drizzleMock.select.mockReturnValue({
      from: mockFrom2,
    } as any);

    const res2 = await testApp.request(
      "/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@test.com",
          password: "wrongpassword",
        }),
      },
      mockEnv,
    );
    expect(res2.status).toBe(401);
    const body2 = (await res2.json()) as ErrorResponse;
    expect(body2.message).toBe("Invalid credentials");
  });
  it("Updates last login date", async () => {
    const mockWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const mockFrom = vi.fn().mockReturnValue({
      where: mockWhere,
    });
    drizzleMock.select.mockReturnValue({
      from: mockFrom,
    } as any);

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

    await testApp.request(
      "/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@test.com",
          password: "Test1234!",
        }),
      },
      mockEnv,
    );

    expect(drizzleMock.update).toHaveBeenCalled();
  });
  it("Succedes on valid credentials", async () => {
    const mockWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const mockFrom = vi.fn().mockReturnValue({
      where: mockWhere,
    });
    drizzleMock.select.mockReturnValue({
      from: mockFrom,
    } as any);

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
      "/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@test.com",
          password: "Test1234!",
        }),
      },
      mockEnv,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as AuthResponse;
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });
});

describe("POST /signup", () => {
  it("Validates body", async () => {
    const res = await testApp.request(
      "/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "",
          password: "",
        }),
      },
      mockEnv,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as ErrorResponse;
    expect(body.message).toBeDefined();
  });
  it("Fails if user already exists", async () => {
    // Mock existing user check - should return a user
    const mockWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const mockFrom = vi.fn().mockReturnValue({
      where: mockWhere,
    });
    drizzleMock.select.mockReturnValue({
      from: mockFrom,
    } as any);

    const res = await testApp.request(
      "/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@test.com",
          password: "Test1234!",
        }),
      },
      mockEnv,
    );
    expect(res.status).toBe(409);
    const body = (await res.json()) as ErrorResponse;
    expect(body.message).toBe("User already exists");
  });
  it("Fails upgrading anonymous user if provided token is invalid", async () => {
    // Mock existing user check - should return undefined (no user exists  )
    const mockSelectWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(undefined),
    });
    const mockSelectFrom = vi.fn().mockReturnValue({
      where: mockSelectWhere,
    });
    drizzleMock.select.mockReturnValue({
      from: mockSelectFrom,
    } as any);

    // Mock user insert for new signup (since token is invalid)
    const mockInsertReturning = vi.fn().mockReturnValue({
      get: vi
        .fn()
        .mockResolvedValue({ id: MOCK_USER.id, hookId: MOCK_USER.hookId }),
    });
    const mockInsertValues = vi.fn().mockReturnValue({
      returning: mockInsertReturning,
    });
    drizzleMock.insert.mockReturnValue({
      values: mockInsertValues,
    } as any);

    const res = await testApp.request(
      "/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer InvalidToken",
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "Test1234!",
        }),
      },
      mockEnv,
    );
    // Invalid token is treated as new signup, so should succeed with 201
    expect(res.status).toBe(201);
    const body = (await res.json()) as AuthResponse;
    expect(body.accessToken).toBeDefined();
  });
  it("Upgrades an anonymous user to a permanent one", async () => {
    // Mock existing user check - should return undefined (no user exists)
    const mockSelectWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(undefined),
    });
    const mockSelectFrom = vi.fn().mockReturnValue({
      where: mockSelectWhere,
    });
    drizzleMock.select.mockReturnValue({
      from: mockSelectFrom,
    } as any);

    // Mock user update for upgrade
    const mockUpdateReturning = vi.fn().mockReturnValue({
      get: vi
        .fn()
        .mockResolvedValue({ id: MOCK_USER.id, hookId: MOCK_USER.hookId }),
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
      "/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            getAccessToken({ uid: MOCK_USER.id }, mockEnv.JWT_ACCESS_SECRET),
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "Test1234!",
        }),
      },
      mockEnv,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as AuthResponse;
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
    expect(drizzleMock.update).toHaveBeenCalled();
  });
  it("Succedes on valid signup", async () => {
    // Mock existing user check - should return undefined (no user exists)
    const mockSelectWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(undefined),
    });
    const mockSelectFrom = vi.fn().mockReturnValue({
      where: mockSelectWhere,
    });
    drizzleMock.select.mockReturnValue({
      from: mockSelectFrom,
    } as any);

    // Mock user insert
    const mockInsertReturning = vi.fn().mockReturnValue({
      get: vi
        .fn()
        .mockResolvedValue({ id: MOCK_USER.id, hookId: MOCK_USER.hookId }),
    });
    const mockInsertValues = vi.fn().mockReturnValue({
      returning: mockInsertReturning,
    });
    drizzleMock.insert.mockReturnValue({
      values: mockInsertValues,
    } as any);

    const res = await testApp.request(
      "/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@test.com",
          password: "Test1234!",
        }),
      },
      mockEnv,
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
    expect(drizzleMock.insert).toHaveBeenCalled();
  });
});

describe("POST /refresh", () => {
  it("Fails if required fields aren't provided", async () => {
    const res = await testApp.request(
      "/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
      mockEnv,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as ErrorResponse;
    expect(body.message).toBeDefined();
  });
  it("Fails if refresh token is invalid malformed", async () => {
    const res = await testApp.request(
      "/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: "InvalidToken",
        }),
      },
      mockEnv,
    );
    expect(res.status).toBe(401);
  });
  it("Fails if refresh token signature is invalid", async () => {
    const res = await testApp.request(
      "/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: INVALID_REFRESH_TOKEN,
        }),
      },
      mockEnv,
    );
    expect(res.status).toBe(401);
  });
  it("Updates last login date", async () => {
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

    await testApp.request(
      "/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: getRefreshToken(
            MOCK_USER.id,
            mockEnv.JWT_REFRESH_SECRET,
          ),
        }),
      },
      mockEnv,
    );

    expect(drizzleMock.update).toHaveBeenCalled();
  });
  it("Succedes on valid refresh", async () => {
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
      "/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: getRefreshToken(
            MOCK_USER.id,
            mockEnv.JWT_REFRESH_SECRET,
          ),
        }),
      },
      mockEnv,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as AuthResponse;
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });
});
