import { NotificationsProvider } from "./src/contexts/NotificationsContext";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  SourceSansPro_700Bold,
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
} from "@expo-google-fonts/source-sans-pro";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { ThemeProvider } from "@shopify/restyle";
import { lightTheme, darkTheme } from "./src/utils/theme";
import { AuthProvider } from "./src/contexts/AuthContext";
import { DataProvider } from "./src/contexts/DataContext";
import * as Notifications from "expo-notifications";
import Toaster from "./src/components/Toaster";
import { LogBox } from "react-native";
import { useColorScheme } from "react-native";
import "./src/utils/sentry";

// Workaround to disable firebase console spamming
// https://stackoverflow.com/a/64832663/12661017
LogBox.ignoreLogs(["Setting a timer"]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

Notifications.addNotificationResponseReceivedListener((notification) => {
  console.log("Notification recived", notification);
});

export default function App() {
  const colorScheme = useColorScheme();

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
      <AuthProvider>
        <DataProvider>
          <NotificationsProvider>
            <SafeAreaProvider>
              <NavigationContainer
                theme={colorScheme === "light" ? DefaultTheme : DarkTheme}
              >
                <RootStackNavigator />
              </NavigationContainer>
              <Toaster />
            </SafeAreaProvider>
            <StatusBar />
          </NotificationsProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
