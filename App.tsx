import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaProvider } from "react-native-safe-area-context";
import InboxScreen from "./src/screens/InboxScreen";
import theme from "./src/utils/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

import {
  SourceSansPro_700Bold,
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
} from "@expo-google-fonts/source-sans-pro";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import SettingsScreen from "./src/screens/SettingsScreen";
import { RootStackParamList } from "./src/navigation/types";
import NotificationDetail from "./src/screens/NotificationDetail";

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
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Inbox"
          screenOptions={{
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerTintColor: theme.colors.gray900,
            headerLargeTitleStyle: {
              fontWeight: "bold",
              fontFamily: theme.fonts.sourceSansPro.bold,
            },
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: theme.fonts.sourceSansPro.bold,
            },
          }}
        >
          <Stack.Screen name="Inbox" component={InboxScreen} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerLargeStyle: false }}
          />
          <Stack.Screen
            name="NotificationDetail"
            component={NotificationDetail}
            options={({ route }) => ({
              headerLargeTitle: false,
              title: route.params.title,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
