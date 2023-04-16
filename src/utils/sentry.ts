import * as Sentry from "sentry-expo";

export const routingInstrumentation =
  new Sentry.Native.ReactNavigationInstrumentation();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: process.env.NODE_ENV === "development",
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
  tracesSampleRate: 0.55,
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});
