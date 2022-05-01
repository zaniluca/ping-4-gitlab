import React from "react";
import { Box, Text } from "../restyle";
import Constants from "expo-constants";
import { openUrl } from "../../utils/open-url";

const SettingsListFooter = () => {
  return (
    <Box flex={1} alignItems="center" paddingTop="l">
      <Text variant="caption" color="gray600">
        {Constants.manifest?.name} ({Constants.manifest?.version})
      </Text>
      {/* <Text marginTop="s" variant="caption" color="gray600">
        This app is code is Open Source, check it out on{" "}
        <Text
          color="blue"
          onPress={() => openUrl("https://github.com/zaniluca/ping-4-gitlab")}
        >
          Github
        </Text>
      </Text> */}
    </Box>
  );
};

export default SettingsListFooter;
