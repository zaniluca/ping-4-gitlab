// Augment the Cloudflare namespace to add custom env vars
declare namespace Cloudflare {
  interface Env {
    SENTRY_RELEASE?: string;
    ANDROID_EMULATOR?: string;
    EXPO_ACCESS_TOKEN?: string;
    ENVIRONMENT: "production" | "staging" | "development" | "test";
    SENTRY_ENVIRONMENT?: "production" | "staging" | "development";
  }
}
