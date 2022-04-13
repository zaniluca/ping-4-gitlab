import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"GetStarted">;

const GetStartedScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        <Text>
          Welcome too Ping4Gitlab! To connect your gitlab account we don’t need
          any permission or access token, we simply use your mail notifications!
        </Text>
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
