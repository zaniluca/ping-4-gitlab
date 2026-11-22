import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@shopify/restyle";

import { InboxStackParamList } from "./types";
import GetStartedScreen from "../screens/GetStartedScreen";
import InboxScreen from "../screens/InboxScreen";
import NotificationDetail from "../screens/NotificationDetail";
import AccountSettingsScreen from "../screens/settings/AccountSettingsScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

const Stack = createNativeStackNavigator<InboxStackParamList>();

const InboxStackNavigator = () => {
  const theme = useTheme();

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
      <Stack.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          gestureEnabled: false,
          headerBackVisible: false,
          headerLargeTitle: true,
          title: "Inbox",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{
          title: "Account",
        }}
      />
      <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
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
    </Stack.Navigator>
  );
};

export default InboxStackNavigator;
