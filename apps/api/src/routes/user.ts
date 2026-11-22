import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { users } from "../db/schema";
import { USER_PUBLIC_FIELDS } from "../utils/constants";
import { userUpdateBodySchema } from "../utils/validation";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { AppEnv } from "../utils/types";
import { validate } from "../middlewares/validation";

const user = new Hono<AppEnv>();

user.get("/", async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload?.uid as string;

  try {
    const foundUser = await c.var.db
      .select(USER_PUBLIC_FIELDS)
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!foundUser) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return c.json(foundUser);
  } catch (e) {
    if (e instanceof HTTPException) throw e;

    console.error("Error fetching user:", e);
    throw new HTTPException(500, { message: "Could not find user" });
  }
});

user.put("/", validate("json", userUpdateBodySchema), async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId = payload?.uid as string;
    const posthog = c.get("posthog");
    const { password, ...updateData } = c.req.valid("json");

    const updatedUser = await c.var.db
      .update(users)
      .set({
        ...updateData,
        password: password ? bcrypt.hashSync(password, 10) : undefined,
      })
      .where(eq(users.id, userId))
      .returning()
      .get();

    if (updateData.expoPushTokens !== undefined) {
      posthog.capture({
        distinctId: userId,
        event: "push_token_registered",
      });
    }

    return c.json(updatedUser);
  } catch (e) {
    if (e instanceof HTTPException) throw e;

    throw new HTTPException(500, {
      message: "Could not update user",
      cause: e,
    });
  }
});

user.delete("/", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId = payload?.uid as string;
    const posthog = c.get("posthog");

    await c.var.db.delete(users).where(eq(users.id, userId));

    posthog.capture({
      distinctId: userId,
      event: "account_deleted",
    });

    return c.json({ message: "User deleted" });
  } catch (e) {
    if (e instanceof HTTPException) throw e;

    throw new HTTPException(500, {
      message: "Could not delete user",
      cause: e,
    });
  }
});

export default user;
