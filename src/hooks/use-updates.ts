import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export const useUpdates = () => {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);

  useEffect(() => {
    // We cannot check for updates in development
    // Or the app will crash
    if (__DEV__) return;

    console.log("Checking for updates...");
    setIsCheckingForUpdate(true);

    Updates.checkForUpdateAsync().then((update) => {
      if (update.isAvailable) {
        console.log("New update available! Fetching...");
        Toast.show({
          type: "info",
          text1: "A new update is available!",
          text2: "Please wait while we download it.",
        });

        Updates.fetchUpdateAsync().then(() => {
          setIsCheckingForUpdate(false);

          Updates.reloadAsync();
        });
      } else {
        console.log("No updates available.");
        setIsCheckingForUpdate(false);
      }
    });
  }, []);

  return {
    isCheckingForUpdate,
  };
};
