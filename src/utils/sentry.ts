import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";

export const routingInstrumentation =
  new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
  tracesSampleRate: 0.55,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
  _experiments: {
    profilesSampleRate: 1.0,
  },
});

Sentry.configureScope((scope) => {
  scope.setTag("expo-update-id", Updates.updateId);
  scope.setTag("expo-is-embedded-update", Updates.isEmbeddedLaunch);
});
