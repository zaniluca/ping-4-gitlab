import {
  SourceSansPro_700Bold,
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
} from "@expo-google-fonts/source-sans-pro";
import {
  DefaultTheme as NavLightTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { ThemeProvider } from "@shopify/restyle";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import Toaster from "./src/components/Toaster";
import { NotificationsProvider } from "./src/contexts/PushNotificationsContext";
import { useAppState } from "./src/hooks/refetch-hooks";
import useNetworkState from "./src/hooks/use-network-state";
import { useOnlineManager } from "./src/hooks/use-online-manager";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import queryClient from "./src/utils/query-client";
import { lightTheme, darkTheme, NavDarkTheme } from "./src/utils/theme";
import "./src/utils/sentry";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();
  const isOnline = useNetworkState();

  useOnlineManager();
  useAppState();

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

  const [fontsLoaded] = useFonts({
    SourceSansPro_700Bold,
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          theme={colorScheme === "light" ? NavLightTheme : NavDarkTheme}
          onReady={onLayoutRootView}
        >
          <NotificationsProvider>
            {/*  
              Workaround to fix React navigation background on navigation beeing white even on darkmode 
              https://stackoverflow.com/a/67606259/12661017
            */}
            <SafeAreaProvider
              style={
                colorScheme === "dark" && {
                  backgroundColor: darkTheme.colors.primaryBackground,
                }
              }
            >
              <RootStackNavigator />
            </SafeAreaProvider>
            <Toaster />
          </NotificationsProvider>
        </NavigationContainer>
        <StatusBar />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
