import * as Sentry from "@sentry/react-native";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import * as Updates from "expo-updates";
import { Platform } from "react-native";

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
  _experiments: {
    profilesSampleRate: 0.1,
  },
  release: nativeApplicationVersion ?? "dev",
  dist: `${Platform.OS}.${nativeBuildVersion}`,
  environment: process.env.NODE_ENV,
});

Sentry.configureScope((scope) => {
  scope.setTag("expo-update-id", Updates.updateId);
  scope.setTag("expo-is-embedded-update", Updates.isEmbeddedLaunch);
});
