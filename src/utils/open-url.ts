import { Linking } from "react-native";
import * as Sentry from "sentry-expo";

export const openURL = async (url: string) => {
  const isSupported = await Linking.canOpenURL(url);

  if (isSupported) {
    await Linking.openURL(url);
  } else {
    Sentry.Native.captureMessage(`Don't know how to open this URL: ${url}`);
    console.log(`Don't know how to open this URL: ${url}`);
  }
};
