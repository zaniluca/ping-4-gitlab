import { StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";
import SettingsSectionedList from "../../components/settings/SettingsSectionedList";

type Props = RootStackScreenProps<"Settings">;

const AccountSettingsScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <SettingsSectionedList />
    </SafeAreaView>
  );
};

export default AccountSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
