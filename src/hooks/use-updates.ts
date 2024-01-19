import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";
import { useState } from "react";
import Toast from "react-native-toast-message";

export const useUpdates = () => {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);

  const updateEventHandler = async (event: Updates.UpdateEvent) => {
    setIsCheckingForUpdate(true);

    if (event.type === Updates.UpdateEventType.ERROR) {
      console.error("Error while checking for updates", event.message);
      Sentry.captureException(event.message);

      setIsCheckingForUpdate(false);
    } else if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
      console.log("No updates available.");

      setIsCheckingForUpdate(false);
    } else if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      console.log("New update available! Fetching...");
      Toast.show({
        type: "info",
        text1: "A new update is available!",
        text2: "Please wait while we download it.",
      });

      const result = await Updates.fetchUpdateAsync();

      console.log("Update fetched", result);

      Sentry.addBreadcrumb({
        event_id: "fetch-update",
        category: "updates",
        message: "Update fetched",
        level: "info",
      });

      setIsCheckingForUpdate(false);

      if (result.isNew) {
        console.log("New update available! Reloading...");
        try {
          await Updates.reloadAsync();
        } catch (error) {
          console.error("Could not reload app after update", error);
          Sentry.captureException(error);
        }
      }
    }
  };

  Updates.useUpdateEvents(updateEventHandler);

  return {
    isCheckingForUpdate,
  };
};
