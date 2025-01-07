import { LinkingOptions } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import Linking from "expo-linking";
import * as Notifications from "expo-notifications";

import { RootStackParamList } from "./types";

const handleNotificationDeepLink = (
  response: Notifications.NotificationResponse | null
) => {
  if (!response?.notification) return;
  if (response.notification.request.content.data?.url) {
    return response.notification.request.content.data.url as string;
  } else if (response.notification.request.content.data?.nid) {
    return `notification/${response.notification.request.content.data.nid}`;
  } else {
    Sentry.captureMessage("Received notification with missing fields", {
      extra: {
        // Needed to avoid sentry cutting the object depth
        response: JSON.stringify(response, null, 2),
      },
    });
  }

  return null;
};

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      NotificationDetail: {
        path: "notification/:id",
      },
    },
  },
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    const initialURL = await Linking.getInitialURL();

    if (initialURL != null) {
      return initialURL;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();
    return handleNotificationDeepLink(response);
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    const eventListenerSubscription = Linking.addEventListener(
      "url",
      onReceiveURL
    );

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = handleNotificationDeepLink(response);
        if (url) {
          // Let React Navigation handle the URL
          listener(url);
        }
      }
    );

    return () => {
      eventListenerSubscription.remove();
      subscription.remove();
    };
  },
};
