import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import * as Sentry from "sentry-expo";

export const useUpdates = () => {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);

  const handleCheckForUpdate = async () => {
    console.log("Checking for updates...");

    Sentry.Native.addBreadcrumb({
      event_id: "check-for-update",
      category: "updates",
      message: "Checking for updates",
      level: "info",
    });

    try {
      setIsCheckingForUpdate(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        console.log("New update available! Fetching...");
        Toast.show({
          type: "info",
          text1: "A new update is available!",
          text2: "Please wait while we download it.",
        });

        const result = await Updates.fetchUpdateAsync();

        console.log(result);

        Sentry.Native.addBreadcrumb({
          event_id: "fetch-update",
          category: "updates",
          message: "Update fetched",
          level: "info",
        });

        setIsCheckingForUpdate(false);
        await Updates.reloadAsync();
      } else {
        console.log("No updates available.");
      }
    } catch (error) {
      Sentry.Native.captureException(error);
    }
    setIsCheckingForUpdate(false);
  };

  useEffect(() => {
    // We cannot check for updates in development
    // Or the app will crash
    if (__DEV__) return;
    handleCheckForUpdate();
  }, []);

  return {
    isCheckingForUpdate,
  };
};