import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log("Push notifications are not available on simulators");
    return;
  }
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.error("Failed to get push token for push notification!");
    return;
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

  // TODO: Upload
  return token;
};
