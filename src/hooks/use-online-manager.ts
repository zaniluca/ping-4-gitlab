import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export function useOnlineManager() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      return NetInfo.addEventListener((state) => {
        const isOnline =
          state.isConnected != null &&
          state.isConnected &&
          Boolean(state.isInternetReachable);

        if (!isOnline)
          Toast.show({
            type: "error",
            text1: "No internet connection",
            text2: "It seems you are offline (NetInfo)",
            autoHide: false,
          });

        onlineManager.setOnline(isOnline);
      });
    }
  }, []);
}
