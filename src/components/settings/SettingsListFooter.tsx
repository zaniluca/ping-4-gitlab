import Constants from "expo-constants";
import React from "react";
import { Platform } from "react-native";

import { openUrl } from "../../utils/open-url";
import { Box, Text } from "../restyle";

const SettingsListFooter = () => {
  return (
    <Box flex={1} alignItems="center" paddingTop="l">
      <Text variant="caption" color="secondary">
        {Constants.manifest?.name} {Constants.manifest?.version} (
        {Platform.OS === "ios"
          ? Constants.manifest?.ios?.buildNumber
          : Constants.manifest?.android?.versionCode}
        )
      </Text>
      <Text marginTop="s" variant="caption" color="secondary">
        This app is open sourced on{" "}
        <Text
          color="blue"
          onPress={() => openUrl("https://github.com/zaniluca/ping-4-gitlab")}
        >
          GitHub
        </Text>
      </Text>
    </Box>
  );
};

export default SettingsListFooter;
