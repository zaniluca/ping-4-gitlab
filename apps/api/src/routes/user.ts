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
    const { password, email, expoPushTokens, mutedUntil } = c.req.valid("json");

    const updateData: Record<string, any> = {};
    if (email !== undefined) updateData.email = email;
    if (expoPushTokens !== undefined)
      updateData.expoPushTokens = expoPushTokens;
    if (mutedUntil !== undefined) updateData.mutedUntil = mutedUntil;
    if (password) updateData.password = bcrypt.hashSync(password, 10);

    const updatedUser = await c.var.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning()
      .get();

    return c.json(updatedUser);
  } catch (e) {
    if (e instanceof HTTPException) throw e;

    throw new HTTPException(500, { message: "Could not update user" });
  }
});

user.delete("/", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId = payload?.uid as string;

    await c.var.db.delete(users).where(eq(users.id, userId));

    return c.json({ message: "User deleted" });
  } catch (e) {
    if (e instanceof HTTPException) throw e;

    throw new HTTPException(500, { message: "Could not delete user" });
  }
});

export default user;
