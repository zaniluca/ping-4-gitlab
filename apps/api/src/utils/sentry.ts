import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// https://docs.railway.com/reference/variables#git-variables
const release =
  process.env.RAILWAY_GIT_COMMIT_SHA ?? process.env.SENTRY_RELEASE;

console.log("Sentry release:", release);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  integrations: [nodeProfilingIntegration(), Sentry.prismaIntegration()],
  tracesSampleRate: 0.05,
  profilesSampleRate: 0.05,
  release,
  // This env should be implicitly used by the SDK but let's make it explicit
  environment: process.env.SENTRY_ENVIRONMENT,
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
