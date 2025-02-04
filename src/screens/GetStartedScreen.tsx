import { useFocusEffect } from "@react-navigation/native";
import * as Updates from "expo-updates";
import { useCallback, useLayoutEffect, PropsWithChildren } from "react";
import { BackHandler, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../components/Button";
import CopyToCliboard from "../components/CopyToCliboard";
import Toaster from "../components/Toaster";
import { Box, Text } from "../components/restyle";
import { useLogout } from "../hooks/auth-hooks";
import { useDeleteUser, useUser } from "../hooks/user-hooks";
import { InboxStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = InboxStackScreenProps<"GetStarted">;

const GetStartedScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const logout = useLogout();

  const user = useUser({
    refetchInterval: 5000,
  });

  const deleteUser = useDeleteUser();

  useLayoutEffect(() => {
    if (user.hasCompletedOnboarding) {
      // User correctly added the hook and recived a notification
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.navigate("Inbox");
    }
  }, [navigation, user]);

  // https://reactnavigation.org/docs/custom-android-back-button-handling/
  useFocusEffect(
    useCallback(() => {
      // Returning true from onBackPress denotes that we have handled the event
      const onBackPress = () => true;

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [user.hasCompletedOnboarding])
  );

  const handleGoBackToLanding = async () => {
    if (user.isAnonymous) {
      // Only deleting anonymous users
      await deleteUser.mutateAsync();
    } else {
      // Logging out authenticated users
      await logout();
    }
  };

  const hookEmail =
    user.data?.hookId +
    (Updates.channel === "production" ? "@pfg.app" : "@staging.pfg.app");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryBackground,
      }}
      edges={["right", "left", "bottom"]}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Box paddingHorizontal="l" paddingVertical="s">
          <Text variant="headline">Welcome to Ping for Gitlab!</Text>
          <Text variant="body">
            Connecting your Gitlab account is as simple as adding a new address
            to your associated emails.
          </Text>
          <Text variant="body" marginTop="l">
            By adding the address we give you as the notifications address you
            will start reciving messages delivered instanly to your phone.
            everything else like which notifications to recive and so on and so
            forth will be configurable from gitlab!
          </Text>
          <Text variant="headline" marginTop="l">
            Make sure to read all the way throgh this guide before starting!
          </Text>
          <Text variant="body" marginTop="s">
            In order to setuo your account you will need to follow these simple
            steps:
          </Text>
          <BulletPointListItem>
            Go to <Text color="blue">gitlab.com</Text> and login with your
            account.
          </BulletPointListItem>
          <BulletPointListItem>
            Head to <Text color="blue">Preferences</Text> and then{" "}
            <Text color="blue">Emails</Text>.
          </BulletPointListItem>
          <BulletPointListItem>
            You will need to add this email:
          </BulletPointListItem>
          <CopyToCliboard marginTop="l" content={hookEmail} />
          <Text variant="caption" color="secondary" marginTop="xs">
            Tap on this box to copy it to your clipboard!
          </Text>
          <Text marginTop="l" variant="headline">
            Wait until the end before pressing{" "}
            <Text color="blue">"Add email address"</Text> or this screen will
            dismiss.
          </Text>
          <BulletPointListItem>
            After adding the email this screen will dismiss and you will get
            your first message in this app with the confirmation link, open the
            message and <Text color="blue">Confirm the email address</Text>.
          </BulletPointListItem>
          <BulletPointListItem>
            Lastly head over to the <Text color="blue">Notifications</Text>{" "}
            section in gitlab preferences and set this newly added mail as your{" "}
            <Text color="blue">Notification email</Text> (The address will only
            appear after confirmation).
          </BulletPointListItem>
          <BulletPointListItem>
            Thank you for reading all the way throug! Now you can procede with
            the steps above and enjoy reciving all your team updates directly on
            your phone!
          </BulletPointListItem>
          <Text variant="body" marginTop="3xl">
            In case you already have an account and went here by mistake press
            the button below!
          </Text>
        </Box>
        <Box padding="l">
          <Button onPress={handleGoBackToLanding}>Go back to landing</Button>
        </Box>
      </ScrollView>
      <Toaster />
    </SafeAreaView>
  );
};

const BulletPointListItem: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box flexDirection="row" marginTop="s">
      <Text variant="body">{"\u2022"}</Text>
      <Text variant="body" paddingLeft="s">
        {children}
      </Text>
    </Box>
  );
};

export default GetStartedScreen;
