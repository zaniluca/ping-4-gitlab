import * as Sentry from "@sentry/react-native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

export function useNotificationDeepLink() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const previousResponseId = useRef<string | null>(null);

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.identifier !==
        previousResponseId.current
    ) {
      // Update the ref to track we've handled this notification
      previousResponseId.current =
        lastNotificationResponse.notification.request.identifier;

      const data = lastNotificationResponse.notification.request.content.data;

      let url: string | null = null;

      if (data?.url) {
        url = data.url as string;
      } else if (data?.nid) {
        url = Linking.createURL(`notifications/${data.nid}`);
      } else {
        Sentry.captureMessage("Received notification with missing fields", {
          extra: {
            response: JSON.stringify(lastNotificationResponse, null, 2),
          },
        });
      }

      if (url) {
        console.log("Opening notification deep link:", url);
        Linking.openURL(url).catch((error) => {
          console.error("Error opening notification URL:", error);
          Sentry.captureException(error);
        });
      }
    }
  }, [lastNotificationResponse]);
}
