import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../components/IconButton";
import InboxList from "../components/inbox/InboxList";
import { RootStackParamList } from "../navigation/types";
import theme from "../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Inbox">;

export default function InboxScreen({ navigation }: Props) {
  React.useLayoutEffect(() => {
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
