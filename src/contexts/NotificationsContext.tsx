import * as Notifications from "expo-notifications";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "react-native-toast-message";

import { useRootStackNavigation } from "../navigation/RootStackNavigator";
import {
  registerForPushNotificationsAsync,
  resetAppBadge,
} from "../utils/notifications";
import { useAuth } from "./AuthContext";
import { useData } from "./DataContext";

type NotificationsContextValues = {
  pushToken?: string;
};

export const NotificationsContext = createContext<NotificationsContextValues>(
  {}
);

// Handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
  handleSuccess: async (nid) => {
    console.log("Recived push notification in foreground with id: ", nid);

    Toast.show({
      type: "info",
      text1: "New notification recived!",
      text2: "Take a look at your inbox",
    });
  },
  handleError: async (nid, error) =>
    console.error(
      "Error when reciving push notification in foreground with id: ",
      nid,
      error
    ),
});

Notifications.addNotificationResponseReceivedListener((notification) =>
  console.log("Notification recived", notification)
);

export const NotificationsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { user } = useAuth();
  const [pushToken, setPushToken] = useState<string | undefined>();
  const { updateUserData, userData, getNotificationById } = useData();
  const navigation = useRootStackNavigation();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!lastNotificationResponse) return;

    console.log("lastNotificationResponse: ", lastNotificationResponse);
    const nid = lastNotificationResponse.notification.request.content.data
      .nid as string | undefined;
    if (!nid) {
      console.error("Notification id not present in notification data");
      return;
    }

    getNotificationById(nid).then((notification) => {
      if (!notification) {
        console.error("Notification not found with id: ", nid);
        return;
      }

      navigation.navigate("NotificationDetail", notification);
    });
  }, [lastNotificationResponse]);

  useEffect(() => {
    if (!userData || !user) return;

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
      const tokens = userData.expo_push_tokens ?? [];
      console.log("ExpoPushToken: ", token);
      // We are on emulator or the user has not allowed notifications
      if (!token) return;
      // Token already present in firebase
      if (tokens.includes(token)) return;

      updateUserData({
        expo_push_tokens: [...tokens, token],
      });
    });
    // Here we put userData.onboarding to avoid re-adding the expo_push_token when the user logs out
    // If the user logs out and so removes the expo_push_token, we MUST NOT re-execute this effect
    // see: https://github.com/zaniluca/ping-4-gitlab/issues/86
  }, [userData?.onboarding, user]);

  useEffect(() => {
    resetAppBadge();
  }, []);

  return (
    <NotificationsContext.Provider value={{ pushToken }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
