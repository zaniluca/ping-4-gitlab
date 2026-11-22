import * as Application from "expo-application";
import * as WebBrowser from "expo-web-browser";
import React from "react";

import { Box, Text } from "../restyle";

const SettingsListFooter = () => {
  return (
    <Box flex={1} alignItems="center" paddingTop="xl">
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
          onPress={async () =>
            await WebBrowser.openBrowserAsync(
              "https://github.com/zaniluca/ping-4-gitlab"
            )
          }
        >
          GitHub
        </Text>
      </Text>
    </Box>
  );
};

export default SettingsListFooter;
