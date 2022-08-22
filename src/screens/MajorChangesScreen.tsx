import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../components/Button";
import { Box, Text } from "../components/restyle";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"MajorChanges">;

// TODO: remove
const MajorChangesScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

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
          <Text variant="largeTitle">Big News!</Text>
          <Text variant="body" marginTop="s">
            Ping for Gitlab is evolving and we are working hard to make the app
            more stable and secure.
          </Text>
          <Text variant="body" marginTop="m">
            Starting from the next major (2.0.0) we will be relying on a new
            infrastructure to safely store your data. Because of that, we will
            be migrating your account, to make sure that you can continue to use
            the app without any issues or disruptions please{" "}
            <Text variant="headline" color="blue">
              Upgrade to a permanent account
            </Text>{" "}
            by clicking the button below.
          </Text>
          <Box marginTop="m" flexDirection="row" justifyContent="flex-end">
            <Text textAlign="right" variant="callout" color="secondary">
              Thanks for your support - Luca from Ping4Gitlab
            </Text>
          </Box>
          <Box marginTop="xxl">
            <Button onPress={() => navigation.navigate("Signup")}>
              Create permanent account
            </Button>
          </Box>
          <Box flex={1} marginTop="s" alignItems="center">
            <TouchableOpacity onPress={() => navigation.navigate("Inbox")}>
              <Text variant="headline" color="accent">
                I don't care, let me access the Inbox
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MajorChangesScreen;
