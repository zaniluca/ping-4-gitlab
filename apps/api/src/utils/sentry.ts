import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
console.log("Sentry DSN: ", process.env.SENTRY_DSN);
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  integrations: [nodeProfilingIntegration(), Sentry.prismaIntegration()],
  tracesSampleRate: 0.33,
  profilesSampleRate: 0.33,
  beforeSendTransaction(event) {
    // Remove the cursor from the transaction
    event.transaction = event.transaction?.replace(
      /cursor=\w+/,
      "cursor={cursor}"
    );

    // Remove the notification id after /notification/ from the transaction
    event.transaction = event.transaction?.replace(
      /\/notification\/\w+\d+/,
      "/notification/{id}"
    );

    return event;
  },
});
