import * as Sentry from "@sentry/cloudflare";
import { lt } from "drizzle-orm";
import { getDrizzleClient } from "./db/client";
import { notifications } from "./db/schema";
import { AppEnv } from "./utils/types";
import { getLogger, Logger } from "./utils/logger";

const EVERY_DAY_AT_MIDNIGHT_CRON = "0 0 * * *";

export const crons: ExportedHandlerScheduledHandler<
  AppEnv["Bindings"]
> = async (event, env, _ctx) => {
  const logger = getLogger(env);
  const startTime = Date.now();

  logger.assign({
    cron: {
      schedule: event.cron,
      scheduledTime: event.scheduledTime,
    },
  });

  try {
    switch (event.cron) {
      case EVERY_DAY_AT_MIDNIGHT_CRON:
        await deleteOldNotifications(env, logger);
        break;
    }
    logger.assign({
      outcome: "success",
    });
  } catch (error) {
    logger.assign({
      outcome: "error",
    });
    if (error instanceof Error) {
      logger.assign({
        error: {
          type: error.name,
          message: error.message,
          stack: error.stack,
        },
      });
    }
  } finally {
    logger.assign({
      durationMs: Date.now() - startTime,
    });
  }

  if (logger.bindings().outcome === "error") {
    logger.error("Error executing scheduled task");
  } else {
    logger.info("Scheduled task completed successfully");
  }
};

async function deleteOldNotifications(env: AppEnv["Bindings"], logger: Logger) {
  const db = getDrizzleClient(env.DB);

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  logger.assign({ cutoffDate: twoYearsAgo.toISOString() });

  try {
    const result = await db
      .delete(notifications)
      .where(lt(notifications.recived, twoYearsAgo));

    logger.assign({ deletedCount: result.meta.changes || 0 });
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("cron", true);
      scope.setContext("Cron", {
        name: "deleteOldNotifications",
        schedule: EVERY_DAY_AT_MIDNIGHT_CRON,
      });
      scope.setExtra("date", twoYearsAgo);
      Sentry.captureException(error);
    });

    throw error;
  }
}
