import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export function useOnlineManager() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      const unsubscribe = NetInfo.addEventListener((state) => {
        const isOnline =
          state.isConnected != null &&
          state.isConnected &&
          Boolean(state.isInternetReachable);

        if (!isOnline)
          Toast.show({
            type: "error",
            text1: "No internet connection",
            text2: "It seems you are offline",
            autoHide: false,
          });

        onlineManager.setOnline(isOnline);
        setIsOnline(isOnline);
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  return isOnline;
}
