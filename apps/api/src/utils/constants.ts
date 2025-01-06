import type { User } from "@prisma/client";

// Public facing fields for user model that can be sent to the client.
export const USER_PUBLIC_FIELDS: Partial<Record<keyof User, boolean>> = {
  id: true,
  email: true,
  hookId: true,
  expoPushTokens: true,
  onboardingCompleted: true,
  mutedUntil: true,
  gitlabId: true,
};

export const APP_URL_SCHEME =
  process.env.NODE_ENV === "production"
    ? "com.zaniluca.ping4gitlab://"
    : process.env.ANDROID_EMULATOR
    ? "exp://10.0.2.2:8081/--/" // Android emulator w/ Expo
    : "exp://localhost:8081/--/"; // iOS simulator w/ Expo
