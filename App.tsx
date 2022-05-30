import { NotificationsProvider } from "./src/contexts/NotificationsContext";
import {
  DefaultTheme as NavLightTheme,
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
import { lightTheme, darkTheme, NavDarkTheme } from "./src/utils/theme";
import { AuthProvider } from "./src/contexts/AuthContext";
import { DataProvider } from "./src/contexts/DataContext";
import Toaster from "./src/components/Toaster";
import { LogBox } from "react-native";
import { useColorScheme } from "react-native";
import "./src/utils/sentry";

// Workaround to disable firebase console spamming
// https://stackoverflow.com/a/64832663/12661017
LogBox.ignoreLogs(["Setting a timer"]);

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
            <NavigationContainer
              theme={colorScheme === "light" ? NavLightTheme : NavDarkTheme}
            >
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
            </NavigationContainer>
            <StatusBar />
          </NotificationsProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
