import { Hono } from "hono";
import { notifications } from "../db/schema";
import {
  notificationListQuerySchema,
  notificationUpdateBodySchema,
} from "../utils/validation";
import { eq, desc, count, and, lt } from "drizzle-orm";
import { AppEnv } from "../utils/types";
import { validate } from "../middlewares/validation";

const notification = new Hono<AppEnv>();

notification.get(
  "/list",
  validate("query", notificationListQuerySchema),
  async (c) => {
    const payload = c.get("jwtPayload");
    const userId = payload?.uid as string;
    const { cursor, limit } = c.req.valid("query");

    let whereCondition = eq(notifications.userId, userId);

    if (cursor) {
      // Cursor-based pagination: get records where id < cursor
      whereCondition = and(
        eq(notifications.userId, userId),
        lt(notifications.id, cursor),
      )!;
    }

    const notificationsList = await c.var.db
      .select()
      .from(notifications)
      .where(whereCondition)
      .orderBy(desc(notifications.id))
      .limit(limit + 1);

    const [{ value: totalCount }] = await c.var.db
      .select({ value: count() })
      .from(notifications)
      .where(eq(notifications.userId, userId));

    c.header("X-Total-Count", totalCount.toString());

    const hasMore = notificationsList.length > limit;
    const items = hasMore
      ? notificationsList.slice(0, limit)
      : notificationsList;

    return c.json({
      data: items,
      hasMore,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  },
);

notification.get("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("jwtPayload")?.uid as string;
  const posthog = c.get("posthog");

  const foundNotification = await c.var.db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id))
    .get();

  posthog.capture({
    distinctId: userId,
    event: "notification_viewed",
  });

  return c.json(foundNotification);
});

notification.put(
  "/:id",
  validate("json", notificationUpdateBodySchema),
  async (c) => {
    const id = c.req.param("id");
    const { viewed } = c.req.valid("json");

    const updatedNotification = await c.var.db
      .update(notifications)
      .set({ viewed })
      .where(eq(notifications.id, id))
      .returning()
      .get();

    return c.json(updatedNotification);
  },
);

export default notification;
