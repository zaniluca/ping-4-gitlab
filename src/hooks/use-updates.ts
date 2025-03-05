import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

import { useOnlineManager } from "./use-online-manager";

export const useUpdates = () => {
  const isOnline = useOnlineManager();

  const {
    isUpdateAvailable,
    isChecking,
    initializationError,
    checkError,
    downloadError,
  } = Updates.useUpdates();

  useEffect(() => {
    if (__DEV__) {
      console.log("Skipping updates check in development mode");
    } else if (!isOnline) {
      console.log("Skipping updates check because we are offline");
    } else {
      Updates.checkForUpdateAsync();
    }
  }, []);

  useEffect(() => {
    if (initializationError) {
      console.error(
        "An error occurred during updates initialization",
        initializationError
      );
      Sentry.captureException(initializationError.message);
    } else if (checkError) {
      console.error("An error occurred during updates check", checkError);
      Sentry.captureException(checkError.message);
    } else if (downloadError) {
      console.error("An error occurred during updates download", downloadError);
      Sentry.captureException(downloadError.message);

      Toast.show({
        type: "error",
        text1: "An error occurred while downloading the update",
        text2: "Please try again later.",
      });
    }
  }, [initializationError, checkError, downloadError]);

  useEffect(() => {
    if (__DEV__) return;
    if (isUpdateAvailable) {
      update();
    } else {
      console.log("No new update available");
    }
  }, [isUpdateAvailable]);

  const update = async () => {
    console.log("New update available! Fetching...");
    Toast.show({
      type: "info",
      text1: "A new update is available!",
      text2: "Please wait while we download it.",
    });

    const result = await Updates.fetchUpdateAsync();

    console.log("Update fetched", result);

    if (result.isNew) {
      console.log("New update available! Reloading...");
      try {
        await Updates.reloadAsync();
      } catch (error) {
        console.error("Could not reload app after update", error);
        Sentry.captureException(error);
      }
    }
  };

  return {
    isCheckingForUpdate: isChecking,
  };
};
