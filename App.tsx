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
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { LogBox, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Toaster from "./src/components/Toaster";
import { AuthProvider } from "./src/contexts/AuthContext";
import { DataProvider } from "./src/contexts/DataContext";
import { NotificationsProvider } from "./src/contexts/NotificationsContext";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { lightTheme, darkTheme, NavDarkTheme } from "./src/utils/theme";

import "./src/utils/sentry";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./src/utils/query-client";
import { useOnlineManager } from "./src/hooks/use-online-manager";
import { useAppState } from "./src/hooks/refetch-hooks";

// Workaround to disable firebase console spamming
// https://stackoverflow.com/a/64832663/12661017
LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  const colorScheme = useColorScheme();

  useOnlineManager();
  useAppState();

  const [fontsLoaded] = useFonts({
    SourceSansPro_700Bold,
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DataProvider>
            <NavigationContainer
              theme={colorScheme === "light" ? NavLightTheme : NavDarkTheme}
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
          </DataProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
