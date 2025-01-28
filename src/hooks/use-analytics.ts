import PostHog from "posthog-react-native";

export const posthog = new PostHog(
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? ""
  // {
  //   host: "https://eu.i.posthog.com",
  // }
);
