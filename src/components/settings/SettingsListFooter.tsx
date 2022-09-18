import * as Application from "expo-application";
import React from "react";

import { openUrl } from "../../utils/open-url";
import { Box, Text } from "../restyle";

const SettingsListFooter = () => {
  return (
    <Box flex={1} alignItems="center" paddingTop="l">
      {__DEV__ ? (
        <Text variant="caption" color="secondary">
          Ping (Development)
        </Text>
      ) : (
        <Text variant="caption" color="secondary">
          {Application.applicationName} {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion})
        </Text>
      )}
      <Text marginTop="s" variant="caption" color="secondary">
        This app's code is available on{" "}
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
