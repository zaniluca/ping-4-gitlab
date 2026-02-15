import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRef } from "react";

import InboxStackNavigator from "./InboxStackNavigator";
import { RootStackParamList } from "./types";
import Logo from "../components/Logo";
import Skeleton from "../components/Skeleton";
import { useNotificationDeepLink } from "../hooks/use-notification-deep-link";
import { useUpdates } from "../hooks/use-updates";
import { useUser } from "../hooks/user-hooks";
import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import { useTheme } from "../utils/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const theme = useTheme();
  const firstTimeAuth = useRef(true);
  const { isCheckingForUpdate } = useUpdates();

  useNotificationDeepLink();

  const user = useUser({
    onSettled: () => {
      if (firstTimeAuth.current) {
        firstTimeAuth.current = false;
      }
    },
    retry: false,
  });

  if ((user.isLoading && firstTimeAuth.current) || isCheckingForUpdate) {
    return (
      <Skeleton flex={1} alignItems="center" justifyContent="center">
        <Logo fill={theme.colors.red} width={77} height={77} />
      </Skeleton>
    );
  }

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
      {user.data ? (
        <>
          <Stack.Screen
            name="InboxStack"
            component={InboxStackNavigator}
            options={{
              headerShown: false,
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
            name="Landing"
            component={LandingScreen}
            navigationKey="AuthenticatedLanding"
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            navigationKey="UnauthenticatedLogin"
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

export default RootStackNavigator;
