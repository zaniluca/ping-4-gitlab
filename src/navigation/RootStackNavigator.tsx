import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import NotificationDetail from "../screens/NotificationDetail";
import LoginScreen from "../screens/LoginScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SignupScreen from "../screens/SignupScreen";
import InboxScreen from "../screens/InboxScreen";
import theme from "../utils/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Inbox"
      screenOptions={{
        headerLargeTitleShadowVisible: false,
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
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placeholder: "Search for notifications",
          },
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
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
    </Stack.Navigator>
  );
};

export default RootStackNavigator;