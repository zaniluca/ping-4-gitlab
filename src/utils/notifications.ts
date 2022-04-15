import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export const schedulePushNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
};

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    alert("Must use physical device for Push Notifications");
    return;
  }
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
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
