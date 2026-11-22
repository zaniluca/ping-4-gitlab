import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const generateId = ({ prefix }: { prefix: string }) =>
  `${prefix}_${createId()}`;

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "u" })),
  email: text("email").unique(),
  hookId: text("hook_id").unique(),
  password: text("password"),
  expoPushTokens: text("expo_push_tokens", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
  lastLogin: integer("last_login", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  onboardingCompleted: integer("onboarding_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  mutedUntil: integer("muted_until", { mode: "timestamp" }),
  gitlabId: integer("gitlab_id").unique(),
});

export const notifications = sqliteTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "n" })),
  subject: text("subject").notNull(),
  html: text("html").notNull(),
  text: text("text"),
  headers: text("headers", { mode: "json" })
    .notNull()
    .$type<Record<string, string>>(),
  recived: integer("recived", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  viewed: integer("viewed", { mode: "boolean" }).notNull().default(false),
  contentHash: text("content_hash").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
