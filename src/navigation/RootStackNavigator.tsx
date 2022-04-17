import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import NotificationDetail from "../screens/NotificationDetail";
import LoginScreen from "../screens/LoginScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SignupScreen from "../screens/SignupScreen";
import InboxScreen from "../screens/InboxScreen";
import { useTheme } from "../utils/theme";
import GetStartedScreen from "../screens/GetStartedScreen";
import LandingScreen from "../screens/LandingScreen";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import { Text } from "../components/restyle";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const theme = useTheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
        <Text variant="body">Logging in...</Text>
      </SafeAreaView>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitleShadowVisible: false,
        headerTintColor: theme.colors.gray900,
        headerLargeTitleStyle: {
          fontWeight: "bold",
          fontFamily: theme.fontFamily.bold,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontFamily: theme.fontFamily.bold,
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="Inbox"
            component={InboxScreen}
            options={{
              gestureEnabled: false,
              headerBackVisible: false,
              headerLargeTitle: true,
              headerSearchBarOptions: {
                placeholder: "Search for notifications",
              },
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NotificationDetail"
            component={NotificationDetail}
            options={({ route }) => ({
              title: route.params.subject,
            })}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          {/* Modals */}
          <Stack.Screen
            name="GetStarted"
            component={GetStartedScreen}
            options={{
              presentation: "modal",
              title: "Get Started",
              gestureEnabled: false,
              headerLargeTitle: true,
              // Hiding the back button on android
              headerLeft: () => <></>,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export const useRootStackNavigation = () =>
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();

export default RootStackNavigator;
