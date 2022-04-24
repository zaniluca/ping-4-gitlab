import { StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../navigation/types";
import SettingsList from "../components/settings/SettingsList";
import SettingsHeader from "../components/settings/SettingsHeader";

type Props = RootStackScreenProps<"Settings">;

const SettingsScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <SettingsHeader />
      <SettingsList />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
