import { NavigationContainer } from "@react-navigation/native";
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
import theme from "./src/utils/theme";
import { AuthProvider } from "./src/contexts/AuthContext";
import { DataProvider } from "./src/contexts/DataContext";
import * as Notifications from "expo-notifications";
import Toaster from "./src/components/Toaster";
import { LogBox } from "react-native";
import { NotificationsProvider } from "./src/contexts/NotificationsContext";

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
  const [fontsLoaded] = useFonts({
    SourceSansPro_700Bold,
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <DataProvider>
          <NotificationsProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <RootStackNavigator />
              </NavigationContainer>
              <Toaster />
            </SafeAreaProvider>
            <StatusBar style="auto" />
          </NotificationsProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
