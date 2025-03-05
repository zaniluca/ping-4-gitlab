import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export function useOnlineManager() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      const unsubscribe = NetInfo.addEventListener((state) => {
        const isOnline =
          state.isConnected != null &&
          state.isConnected &&
          Boolean(state.isInternetReachable);

        // The isOnline flag is null when the app starts
        if (!isOnline && isOnline != null)
          Toast.show({
            type: "error",
            text1: "No internet connection",
            text2: "It seems you are offline",
            autoHide: false,
          });

        // If we become online and we managed to have a toast, hide it
        if (isOnline && isOnline != null) Toast.hide();

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
