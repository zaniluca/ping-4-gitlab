import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, Text } from "../components/restyle";
import { useData } from "../contexts/DataContext";
import { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"GetStarted">;

const GetStartedScreen: React.FC<Props> = ({ navigation }) => {
  const { userData } = useData();

  useEffect(() => {
    if (!userData?.onboarding) {
      // User correctly added the hook and recived a notification
      navigation.goBack();
    }
  }, [userData]);

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Box paddingHorizontal="m" paddingVertical="s">
          <Text variant="body">
            Welcome to Ping4Gitlab! To connect your gitlab account we don’t need
            any permission or access token, we simply use your mail
            notifications!
          </Text>
          <Text
            variant="body"
            marginTop="m"
          >{`${userData?.hook_id}@p4g.email`}</Text>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
