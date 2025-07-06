import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
  tracesSampleRate: 0.1,
});

Sentry.getGlobalScope().setTags({
  "expo-update-id": Updates.updateId,
  "expo-is-embedded-update": Updates.isEmbeddedLaunch,
});
