import { env } from "cloudflare:workers";
import { users } from "../db/schema";

// Public facing fields for user model that can be sent to the client.
export const USER_PUBLIC_FIELDS = {
  id: users.id,
  email: users.email,
  hookId: users.hookId,
  expoPushTokens: users.expoPushTokens,
  onboardingCompleted: users.onboardingCompleted,
  mutedUntil: users.mutedUntil,
  gitlabId: users.gitlabId,
} as const;

export const APP_URL_SCHEME = ["production", "staging"].includes(
  env.ENVIRONMENT,
)
  ? "ping4gitlab://"
  : env.ANDROID_EMULATOR === "true"
    ? "exp://10.0.2.2:8081/--/" // Android emulator w/ Expo
    : "exp://127.0.0.1:8081/--/"; // iOS simulator w/ Expo
