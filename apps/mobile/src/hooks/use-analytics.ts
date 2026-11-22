import PostHog from "posthog-react-native";

import { isProductionChannel } from "../utils/http";
import { APIUser } from "../utils/types";

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

export const posthog = new PostHog(POSTHOG_API_KEY || "placeholder-key", {
  host: "https://eu.i.posthog.com",
  disabled: !isProductionChannel() || !POSTHOG_API_KEY,
});

export const useAnalytics = () => {
  const identify = (user: Partial<APIUser>) => {
    posthog.identify(user.id, {
      // This is done to avoid undefined properties
      ...(user.email && { email: user.email }),
      ...(user.hookId && { hookId: user.hookId }),
    });
  };

  const reset = () => {
    posthog.reset();
  };

  return {
    identify,
    reset,
  };
};
