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
import { sanitizeSubject } from "../utils/sanitize";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitleShadowVisible: false,
        headerTintColor: theme.colors.primary,
        headerLargeTitleStyle: {
          fontWeight: "bold",
          fontFamily: theme.fontFamily.bold,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontFamily: theme.fontFamily.bold,
        },
        headerBackTitleStyle: {
          fontFamily: theme.fontFamily.semibold,
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
              // headerSearchBarOptions: {
              //   placeholder: "Search for notifications",
              // },
            }}
          />
          <Stack.Screen
            navigationKey="AuthenticatedLogin"
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            navigationKey="AuthenticatedSignup"
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
              title: sanitizeSubject(route.params),
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
            navigationKey="UnauthenticatedLogin"
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            navigationKey="UnauthenticatedSignup"
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
