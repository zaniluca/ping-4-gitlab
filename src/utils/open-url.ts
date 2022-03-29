import { Linking } from "react-native";

export const openUrl = (url: string) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    })
    .catch((reason) => {
      console.log("Can't open url", reason);
    });
};
