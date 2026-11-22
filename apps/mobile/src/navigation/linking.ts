import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "./types";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    initialRouteName: "Landing",
    screens: {
      Login: {
        path: "login",
        parse: {
          accessToken: String,
          refreshToken: String,
          error: String,
        },
      },
      InboxStack: {
        initialRouteName: "Inbox",
        screens: {
          NotificationDetail: {
            path: "notifications/:id",
            parse: {
              id: (id: string) => id,
            },
          },
          Settings: "settings",
          AccountSettings: "settings/account",
        },
      },
    },
  },
  async getInitialURL() {
    // Check if app was opened from a deep link
    const initialURL = await Linking.getInitialURL();
    if (initialURL != null) {
      console.log("Linking initial url:", initialURL);
      return initialURL;
    }

    return null;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => {
      console.log("Recived Linking url:", url);
      listener(url);
    };

    // Listen to incoming links from deep linking
    const eventListenerSubscription = Linking.addEventListener(
      "url",
      onReceiveURL
    );
    return () => {
      eventListenerSubscription.remove();
    };
  },
};
