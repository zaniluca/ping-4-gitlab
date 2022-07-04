import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "react-query";
import { Platform } from "react-native";

export function useOnlineManager() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      return NetInfo.addEventListener((state) => {
        onlineManager.setOnline(
          state.isConnected != null &&
            state.isConnected &&
            Boolean(state.isInternetReachable)
        );
      });
    }
  }, []);
}
