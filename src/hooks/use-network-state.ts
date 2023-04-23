import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import * as Sentry from "sentry-expo";

const useNetworkState = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    Network.getNetworkStateAsync()
      .then((state) => setIsOnline(state.isInternetReachable ?? false))
      .catch((err) => {
        console.warn("Error getting network state", err);
        Sentry.Native.captureException(err);
      });
  }, []);

  useEffect(() => {
    if (!isOnline) {
      Toast.show({
        type: "error",
        text1: "No internet connection",
        text2: "It seems you are offline",
        autoHide: false,
      });
    }
  }, [isOnline]);

  return isOnline;
};

export default useNetworkState;
