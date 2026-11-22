import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDrizzleClient(db: D1Database) {
  return drizzle(db, { schema });
}

export type DrizzleClient = ReturnType<typeof getDrizzleClient>;
