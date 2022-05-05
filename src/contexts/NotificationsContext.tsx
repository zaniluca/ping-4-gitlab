import { createContext, ReactNode, useContext, useEffect } from "react";
import Toast from "react-native-toast-message";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { useData } from "./DataContext";

type NotificationsContextValues = {};

export const NotificationsContext = createContext<NotificationsContextValues>(
  {}
);

type NotificationsContextProps = {
  children: ReactNode;
};

export const NotificationsProvider: React.FC<NotificationsContextProps> = ({
  children,
}) => {
  const { updateUserData, userData } = useData();

  useEffect(() => {
    if (!userData) return;

    registerForPushNotificationsAsync().then((res) => {
      const { token, status } = res;

      if (status === "denied") {
        Toast.show({
          type: "error",
          text1: "Notifications not permitted",
          text2: "We suggest enabling them for the best experience!",
          autoHide: false,
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
  }, [userData]);

  return (
    <NotificationsContext.Provider value={{}}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
