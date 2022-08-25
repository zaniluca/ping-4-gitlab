import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SettingsHeader from "../../components/settings/SettingsHeader";
import SettingsList from "../../components/settings/SettingsList";
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../utils/theme";

type Props = RootStackScreenProps<"Settings">;

const SettingsScreen: React.FC<Props> = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryBackground,
      }}
      edges={["right", "left"]}
    >
      <SettingsHeader />
      <SettingsList />
    </SafeAreaView>
  );
};

export default SettingsScreen;
