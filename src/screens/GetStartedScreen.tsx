import { useLayoutEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import CopyToCliboard from "../components/CopyToCliboard";
import { Box, Text } from "../components/restyle";
import Toaster from "../components/Toaster";
import { useUser } from "../hooks/user-hooks";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"GetStarted">;

const GetStartedScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  // const { deleteUser, user } = useAuth();
  const { data: user } = useUser({
    refetchInterval: 5000,
  });

  useLayoutEffect(() => {
    if (hasCompletedOnboarding) {
      // User correctly added the hook and recived a notification
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.navigate("Inbox");
    }
  }, [navigation, user]);

  // Disabling android hardware back buttons
  useLayoutEffect(() => {
    const listener = navigation.addListener("beforeRemove", (e) => {
      // When user has finished onboarding re-enable back button
      if (hasCompletedOnboarding) {
        e.preventDefault();
      }
      return;
    });
    return () => listener();
  }, [navigation, user]);

  const handleGoBackToLanding = async () => {
    // if (user?.isAnonymous) {
    //   // Only deleting anonymous users
    //   await deleteUser();
    // }
    navigation.navigate("Landing");
  };

  const hasCompletedOnboarding = user?.onboardingCompleted;

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
        <Box paddingHorizontal="m" paddingVertical="s">
          <Text variant="headline">Welcome to Ping for Gitlab!</Text>
          <Text variant="body">
            Connecting your Gitlab account is as simple as adding a new address
            to your associated emails.
          </Text>
          <Text variant="body" marginTop="m">
            By adding the address we give you as the notifications address you
            will start reciving messages delivered instanly to your phone.
            everything else like which notifications to recive and so on and so
            forth will be configurable from gitlab!
          </Text>
          <Text variant="headline" marginTop="m">
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
          <CopyToCliboard marginTop="m" content={`${user?.hookId}@pfg.app`} />
          <Text variant="caption" color="secondary" marginTop="xs">
            Tap on this box to copy it to your clipboard!
          </Text>
          <Text marginTop="m" variant="headline">
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
          <Text variant="body" marginTop="xl">
            In case you already have an account and went here by mistake press
            the button below!
          </Text>
        </Box>
        <Box padding="m">
          <Button onPress={handleGoBackToLanding}>Go back to landing</Button>
        </Box>
      </ScrollView>
      <Toaster />
    </SafeAreaView>
  );
};

const BulletPointListItem: React.FC = ({ children }) => {
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
