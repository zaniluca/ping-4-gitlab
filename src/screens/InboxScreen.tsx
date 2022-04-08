import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "@shopify/restyle";
import React, { useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../components/IconButton";
import InboxList from "../components/inbox/InboxList";
import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { Theme } from "../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Inbox">;

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={() => navigation.navigate("Settings")}>
          <Settings stroke={theme.colors.gray600} />
        </IconButton>
      ),
    });
    // navigation.navigate("GetStarted");
  }, [navigation]);

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
