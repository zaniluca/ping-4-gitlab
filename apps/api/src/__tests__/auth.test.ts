import prismaMock from "../../prisma/mocked-client";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "..";
import type { User } from "@prisma/client";
import { getAccessToken, getRefreshToken } from "../utils/common";

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
};

const INVALID_REFRESH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.p7ngO132vgfaib2y-FZ81_nugwqDtI8YS96Y_0Xdom8";

describe("POST /login", () => {
  it("Fails if required fields aren't provided", async () => {
    await request(app)
      .post("/login")
      .send({})
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Missing required fields");
      });
  });
  it("Fails if credentials are invalid", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await request(app)
      .post("/login")
      .send({
        email: "nottest@test.com",
        password: "wrongpassword",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
      });

    prismaMock.user.findUnique.mockResolvedValue(MOCK_USER);

    await request(app)
      .post("/login")
      .send({
        email: "test@test.com",
        password: "wrongpassword",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
      });
  });
  it("Updates last login date", async () => {
    prismaMock.user.findUnique.mockResolvedValue(MOCK_USER);

    await request(app).post("/login").send({
      email: "test@test.com",
      password: "Test1234!",
    });

    expect(prismaMock.user.update).toHaveBeenCalled();
  });
  it("Succedes on valid credentials", async () => {
    prismaMock.user.findUnique.mockResolvedValue(MOCK_USER);

    await request(app)
      .post("/login")
      .send({
        email: "test@test.com",
        password: "Test1234!",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
      });
  });
});

describe("POST /signup", () => {
  it("Validates body", async () => {
    await request(app)
      .post("/signup")
      .send({
        email: "",
        password: "",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBeDefined();
      });
  });
  it("Fails if user already exists", async () => {
    prismaMock.user.count.mockResolvedValue(1);

    await request(app)
      .post("/signup")
      .send({
        email: "test@test.com",
        password: "Test1234!",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("User already exists");
      });
  });
  it("Fails upgrading anonymous user if provided token is invalid", async () => {
    await request(app)
      .post("/signup")
      .set("Authorization", "Bearer " + "InvalidToken")
      .send({
        email: "test@test.com",
        password: "Test1234!",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Unauthorized");
      });
  });
  it("Upgrades an anonymous user to a permanent one", async () => {
    prismaMock.user.count.mockResolvedValue(0);
    prismaMock.user.update.mockResolvedValue(MOCK_USER);

    await request(app)
      .post("/signup")
      .set("Authorization", "Bearer " + getAccessToken(MOCK_USER.id))
      .send({
        email: "test@test.com",
        password: "Test1234!",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(201);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
      });

    expect(prismaMock.user.update).toHaveBeenCalled();
  });
  it("Succedes on valid signup", async () => {
    prismaMock.user.count.mockResolvedValue(0);
    prismaMock.user.create.mockResolvedValue(MOCK_USER);

    await request(app)
      .post("/signup")
      .send({
        email: "test@test.com",
        password: "Test1234!",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(201);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
      });

    expect(prismaMock.user.create).toHaveBeenCalled();
  });
});

describe("POST /anonymous", () => {
  it("Creates a new anonymous user", async () => {
    prismaMock.user.create.mockResolvedValue(MOCK_USER);

    await request(app)
      .post("/anonymous")
      .send({})
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(201);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
      });

    expect(prismaMock.user.create).toHaveBeenLastCalledWith({
      data: {
        hookId: "test",
      },
      select: {
        id: true,
      },
    });
  });
});

describe("POST /refresh", () => {
  it("Fails if required fields aren't provided", async () => {
    await request(app)
      .post("/refresh")
      .send({})
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Missing required fields");
      });
  });
  it("Fails if refresh token is invalid malformed", async () => {
    await request(app)
      .post("/refresh")
      .send({
        refreshToken: "InvalidToken",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Unauthorized");
      });
  });
  it("Fails if refresh token signature is invalid", async () => {
    await request(app)
      .post("/refresh")
      .send({
        refreshToken: INVALID_REFRESH_TOKEN,
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Unauthorized");
      });
  });
  it("Updates last login date", async () => {
    await request(app)
      .post("/refresh")
      .send({
        refreshToken: getRefreshToken(MOCK_USER.id),
      });

    expect(prismaMock.user.update).toHaveBeenCalled();
  });
  it("Succedes on valid refresh", async () => {
    await request(app)
      .post("/refresh")
      .send({
        refreshToken: getRefreshToken(MOCK_USER.id),
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
      });
  });
});
