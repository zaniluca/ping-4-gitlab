import { Hono } from "hono";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { users } from "../db/schema";
import type { User } from "../db/schema";
import {
  getAccessToken,
  getRefreshToken,
  getTokenPayload,
  updateLastLogin,
} from "../utils/common";
import {
  loginBodySchema,
  refreshBodySchema,
  signupBodySchema,
} from "../utils/validation";
import { HTTPException } from "hono/http-exception";
import { getValidHookId } from "../utils/get-valid-hook-id";
import { eq } from "drizzle-orm";
import { AppEnv } from "../utils/types";
import { validate } from "../middlewares/validation";

const auth = new Hono<AppEnv>();

auth.post("/login", validate("json", loginBodySchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const logger = c.get("logger");

  const user = await c.var.db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }
  logger.assign({ user });

  await updateLastLogin(user.id, c.var.db);

  return c.json({
    accessToken: getAccessToken(
      { uid: user.id, hookId: user.hookId },
      c.env.JWT_ACCESS_SECRET,
    ),
    refreshToken: getRefreshToken(user.id, c.env.JWT_REFRESH_SECRET),
  });
});

auth.post("/signup", validate("json", signupBodySchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const logger = c.get("logger");

  // Check for JWT token in Authorization header for anonymous user upgrade
  const authHeader = c.req.header("Authorization");
  let isAnonymous = false;
  let anonymousUserId: string | undefined;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, c.env.JWT_ACCESS_SECRET) as {
        uid: string;
      };
      isAnonymous = true;
      anonymousUserId = decoded.uid;
    } catch (e) {
      // Invalid token, treat as new signup
    }
  }

  const existingUser = await c.var.db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existingUser) {
    throw new HTTPException(409, { message: "User already exists" });
  }

  let user: Pick<User, "id" | "hookId">;

  if (isAnonymous && anonymousUserId) {
    const updatedUser = await c.var.db
      .update(users)
      .set({
        email,
        password: bcrypt.hashSync(password, 10),
      })
      .where(eq(users.id, anonymousUserId))
      .returning({ id: users.id, hookId: users.hookId })
      .get();

    logger.setMsg("Upgraded anonymous user via signup");
    user = updatedUser;
  } else {
    const hookId = await getValidHookId(c.var.db);

    const newUser = await c.var.db
      .insert(users)
      .values({
        email,
        password: bcrypt.hashSync(password, 10),
        hookId,
      })
      .returning({ id: users.id, hookId: users.hookId })
      .get();

    logger.setMsg("Created new user via signup");
    user = newUser;
  }

  logger.assign({ user });

  return c.json(
    {
      accessToken: getAccessToken(
        { uid: user.id, hookId: user.hookId! },
        c.env.JWT_ACCESS_SECRET,
      ),
      refreshToken: getRefreshToken(user.id, c.env.JWT_REFRESH_SECRET),
    },
    isAnonymous ? 200 : 201,
  );
});

auth.post("/refresh", validate("json", refreshBodySchema), async (c) => {
  const { refreshToken } = c.req.valid("json");
  const payload = getTokenPayload(refreshToken);

  try {
    jwt.decode(refreshToken);
    const ok = !!jwt.verify(refreshToken, c.env.JWT_REFRESH_SECRET);
    if (!ok) {
      throw new Error("Invalid token");
    }
  } catch (e) {
    throw new HTTPException(401, { message: "Invalid refresh token" });
  }

  await updateLastLogin(payload.uid, c.var.db);

  return c.json({
    accessToken: getAccessToken(
      { uid: payload.uid, hookId: payload.hookId },
      c.env.JWT_ACCESS_SECRET,
    ),
    refreshToken: getRefreshToken(payload.uid, c.env.JWT_REFRESH_SECRET),
  });
});

export default auth;
