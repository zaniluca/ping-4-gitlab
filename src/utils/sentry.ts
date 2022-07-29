import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: process.env.NODE_ENV === "development",
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
});
