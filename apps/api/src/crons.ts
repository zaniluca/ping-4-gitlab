import { CronJob } from "cron";
import prisma from "../prisma/client";
import * as Sentry from "@sentry/node";

const EVERY_DAY_AT_MIDNIGHT_CRON = "0 0 * * *";

export const oldNotificationDeletionCron = CronJob.from({
  cronTime: EVERY_DAY_AT_MIDNIGHT_CRON,
  onTick: async () => {
    const twoYearsAgo = new Date(
      new Date().setFullYear(new Date().getFullYear() - 2)
    );
    console.log(
      "Running cron job to delete notifications older than: " + twoYearsAgo
    );
    try {
      const res = await prisma.notification.deleteMany({
        where: {
          recived: {
            lte: twoYearsAgo,
          },
        },
      });
      console.log("Deleted " + res.count + " notifications");
    } catch (error) {
      console.error("Error deleting notifications", error);
      Sentry.withScope((scope) => {
        scope.setTag("cron", true);
        scope.setContext("Cron", {
          name: "oldNotificationDeletionCron",
          schedule: EVERY_DAY_AT_MIDNIGHT_CRON,
        });
        scope.setExtra("date", twoYearsAgo);
        Sentry.captureException(error);
      });
    }
  },
  // Prevent the cron from starting automatically
  start: false,
});
