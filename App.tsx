import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Button, TouchableOpacity } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaProvider } from "react-native-safe-area-context";
import InboxScreen from "./src/screens/InboxScreen";
import theme from "./src/utils/theme";

const Stack = createNativeStackNavigator();

import {
  SourceSansPro_700Bold,
  SourceSansPro_400Regular,
} from "@expo-google-fonts/source-sans-pro";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

export default function App() {
  const [fontsLoaded] = useFonts({
    SourceSansPro_700Bold,
    SourceSansPro_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
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
          <Stack.Screen
            name="Inbox"
            component={InboxScreen}
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={() => alert("hi")}>
                  <Settings stroke={theme.colors.gray900} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
