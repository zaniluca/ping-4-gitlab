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
          text2: "Please enable them for the app to work",
          autoHide: false,
        });
        return;
      }

      console.log("ExpoPushToken: ", token);
      if (userData.expo_push_token === token || !token) return;

      updateUserData({ expo_push_token: token });
    });
  }, [userData]);

  return (
    <NotificationsContext.Provider value={{}}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
