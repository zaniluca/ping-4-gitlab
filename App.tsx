import {
  SourceSansPro_700Bold,
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
} from "@expo-google-fonts/source-sans-pro";
import {
  DefaultTheme as NavLightTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { ThemeProvider } from "@shopify/restyle";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from "posthog-react-native";
import { useCallback, useRef } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./src/utils/sentry";
import Toaster from "./src/components/Toaster";
import { NotificationsProvider } from "./src/contexts/PushNotificationsContext";
import { useAppState } from "./src/hooks/refetch-hooks";
import { posthog } from "./src/hooks/use-analytics";
import { useOnlineManager } from "./src/hooks/use-online-manager";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { linking } from "./src/navigation/linking";
import type { RootStackParamList } from "./src/navigation/types";
import queryClient from "./src/utils/query-client";
import { lightTheme, darkTheme, NavDarkTheme } from "./src/utils/theme";
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigationContainerRef<RootStackParamList>();
  const previousScreen = useRef<string | undefined>(undefined);

  useOnlineManager();
  useAppState();

  const [fontsLoaded] = useFonts({
    SourceSansPro_700Bold,
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
  });

  const trackScreen = useCallback(async () => {
    const screen = navigation.getCurrentRoute()?.name;
    if (screen === undefined || screen === previousScreen.current) return;

    previousScreen.current = screen;
    await posthog.screen(screen).catch((error: unknown) => {
      console.warn("Could not record screen view", error);
    });
  }, [navigation]);

  const onNavigationReady = useCallback(async () => {
    await Promise.all([SplashScreen.hideAsync(), trackScreen()]);
  }, [trackScreen]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={navigation}
          theme={colorScheme === "light" ? NavLightTheme : NavDarkTheme}
          onReady={onNavigationReady}
          onStateChange={trackScreen}
          linking={linking}
        >
          <PostHogProvider
            client={posthog}
            autocapture={{ captureScreens: false, captureTouches: true }}
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
          </PostHogProvider>
        </NavigationContainer>
        <StatusBar />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Sentry.wrap(App);
