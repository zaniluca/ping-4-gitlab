import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log("Push notifications are not available on simulators");
    return { token: undefined, status: undefined };
  }
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  if (status !== "granted") {
    console.error("Failed to get push token for push notification!");
    return { token: undefined, status };
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "notification",
    });
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      experienceId: "@zaniluca/ping4gitlab",
    })
  ).data;

  return { token, status };
};

export const resetAppBadge = () => Notifications.setBadgeCountAsync(0);
