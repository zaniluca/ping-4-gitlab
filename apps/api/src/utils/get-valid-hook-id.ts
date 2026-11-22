import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import generateUniqueHook from "./hook-generator";
import { DrizzleClient } from "../db/client";

const MAX_RETRIES = 5;

export async function getValidHookId(db: DrizzleClient) {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    attempts++;
    const hookId = generateUniqueHook();

    const existingHook = await db
      .select({ hookId: users.hookId })
      .from(users)
      .where(eq(users.hookId, hookId))
      .get();

    if (!existingHook) {
      return hookId;
    }
  }

  throw new Error(
    `Failed to generate unique hook ID after ${MAX_RETRIES} attempts`,
  );
}
