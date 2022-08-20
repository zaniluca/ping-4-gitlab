import Constants from "expo-constants";
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: process.env.NODE_ENV === "development",
  enableAutoSessionTracking: true,
  // Sessions close after app is 10 seconds in the background.
  sessionTrackingIntervalMillis: 10000,
  tracesSampleRate: 0.75,
  release: Constants.manifest?.revisionId,
});
