import * as Sentry from "@sentry/react-native";
import { Linking } from "react-native";

export const openURL = async (url: string) => {
  const isSupported = await Linking.canOpenURL(url);

  if (isSupported) {
    await Linking.openURL(url);
  } else {
    Sentry.captureMessage(`Don't know how to open this URL: ${url}`);
    console.log(`Don't know how to open this URL: ${url}`);
  }
};
