import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { focusManager } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
};

export const useAppState = () => {
  useEffect(() => {
    AppState.addEventListener("change", onAppStateChange);
    return () => {
      AppState.removeEventListener("change", onAppStateChange);
    };
  }, []);
};

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );
}
