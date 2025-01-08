import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.warn("Push notifications are not available on simulators");
    return { token: undefined, status: undefined };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "notification.wav",
    });
  }

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  if (status !== "granted") {
    console.warn("Push notifications permission denied");
    return { token: undefined, status };
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error("Failed to get project id for push notification");
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  return { token, status };
};

export const resetAppBadge = () => Notifications.setBadgeCountAsync(0);
