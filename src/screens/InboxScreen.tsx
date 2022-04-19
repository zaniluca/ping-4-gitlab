import React, { useLayoutEffect } from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import IconButton from "../components/IconButton";
import InboxList from "../components/inbox/InboxList";
import { useData } from "../contexts/DataContext";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Inbox">;

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { userData } = useData();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={() => navigation.navigate("Settings")}>
          <Settings stroke={theme.colors.gray600} />
        </IconButton>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!userData) return;
    if (userData.onboarding) {
      navigation.navigate("GetStarted");
    }
  }, [userData]);

  useEffect(() => {
    Toast.show({
      type: "success",
      text1: "Please allow notifications",
      text2:
        "Seems like you didn't allow notifications, please enable them to make the app work",
      autoHide: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <InboxList />
    </SafeAreaView>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
