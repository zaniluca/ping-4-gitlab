import { LinkingOptions } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

import { RootStackParamList } from "./types";

const handleNotificationDeepLink = (
  response: Notifications.NotificationResponse | null
) => {
  if (!response?.notification) return;
  if (response.notification.request.content.data?.url) {
    return response.notification.request.content.data.url as string;
  } else if (response.notification.request.content.data?.nid) {
    return `notifications/${response.notification.request.content.data.nid}`;
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
    initialRouteName: "Landing",
    screens: {
      Login: {
        path: "login",
        parse: {
          accessToken: String,
          refreshToken: String,
          error: String,
        },
      },
      InboxStack: {
        initialRouteName: "Inbox",
        screens: {
          NotificationDetail: {
            path: "notifications/:id",
            parse: {
              id: (id: string) => id,
            },
          },
          Settings: "settings",
          AccountSettings: "settings/account",
        },
      },
    },
  },
  async getInitialURL() {
    // Check if app was opened from a deep link
    const initialURL = await Linking.getInitialURL();
    if (initialURL != null) {
      console.log("Linking initial url:", initialURL);
      return initialURL;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();
    return handleNotificationDeepLink(response);
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => {
      console.log("Recived Linking url:", url);
      listener(url);
    };

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
