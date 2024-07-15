import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";

import { useRootStackNavigation } from "../hooks/navigation-hooks";
import { useNotification } from "../hooks/notifications-hooks";
import { useUpdateUser, useUser } from "../hooks/user-hooks";
import {
  registerForPushNotificationsAsync,
  resetAppBadge,
} from "../utils/notifications";

type NotificationsContextValues = {
  pushToken?: string;
};

export const NotificationsContext = createContext<NotificationsContextValues>(
  {}
);

Notifications.addNotificationResponseReceivedListener((notification) =>
  console.log("Notification recived", notification)
);

export const NotificationsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const user = useUser();
  const [pushToken, setPushToken] = useState<string | undefined>();
  const navigation = useRootStackNavigation();
  const updateUser = useUpdateUser();
  const queryClient = useQueryClient();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [notificationId, setNotificationId] = useState<string | null>(null);

  useNotification(notificationId!, {
    enabled: !!user.data && !!notificationId,
    onSuccess: (data) => {
      navigation.navigate("NotificationDetail", data);
    },
    onError: (error) => {
      console.error("Notification not recived", error);
    },
    onSettled: () => {
      setNotificationId(null);
    },
  });

  useEffect(() => {
    if (!lastNotificationResponse) return;
    if (lastNotificationResponse.notification.request.content.data?.nid) {
      setNotificationId(
        lastNotificationResponse.notification.request.content.data.nid as string
      );
    } else {
      Sentry.configureScope((scope) => {
        scope.setExtra("notification", lastNotificationResponse);
        Sentry.captureMessage("Recived notification without nid");
      });
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    if (!user.data) return;

    registerForPushNotificationsAsync().then((res) => {
      const { token, status } = res;
      setPushToken(token);

      if (status === "denied") {
        Toast.show({
          type: "error",
          text1: "Notifications not permitted",
          text2: "We suggest enabling them for the best experience!",
        });
        return;
      }
      const tokens = user.data.expoPushTokens;
      console.log("ExpoPushToken: ", token);
      // We are on emulator or the user has not allowed notifications
      if (!token) return;
      // Token already present
      if (tokens.includes(token)) return;

      updateUser.mutate({
        expoPushTokens: [...tokens, token],
      });
    });
    // Here we put userData.onboarding to avoid re-adding the expo_push_token when the user logs out
    // If the user logs out and so removes the expo_push_token, we MUST NOT re-execute this effect
    // see: https://github.com/zaniluca/ping-4-gitlab/issues/86
  }, [user.data?.onboardingCompleted]);

  useEffect(() => {
    resetAppBadge();
  }, []);

  // Handler for foreground notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
    handleSuccess: async (nid) => {
      console.log("Recived push notification in foreground with id: ", nid);
      queryClient.invalidateQueries(["notifications"]);

      Toast.show({
        type: "info",
        text1: "New notification recived!",
        text2: "Take a look at your inbox",
        onPress() {
          navigation.navigate("Inbox");
        },
      });
    },
    handleError: async (nid, error) =>
      console.error(
        "Error when reciving push notification in foreground with id: ",
        nid,
        error
      ),
  });

  return (
    <NotificationsContext.Provider value={{ pushToken }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const usePushNotificationsContext = () =>
  useContext(NotificationsContext);
