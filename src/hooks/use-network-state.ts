import * as Network from "expo-network";
import { useEffect, useState } from "react";
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

  return isOnline;
};

export default useNetworkState;
