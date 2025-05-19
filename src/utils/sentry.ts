import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";

export const routingInstrumentation =
  new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
  // release: nativeApplicationVersion ?? "dev",
  // dist: `${Platform.OS}.${nativeBuildVersion}`,
  // environment: process.env.NODE_ENV,
});

Sentry.getGlobalScope().setTags({
  "expo-update-id": Updates.updateId,
  "expo-is-embedded-update": Updates.isEmbeddedLaunch,
});
