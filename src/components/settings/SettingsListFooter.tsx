import React from "react";
import { Box, Text } from "../restyle";
import Constants from "expo-constants";

const SettingsListFooter = () => {
  return (
    <Box flex={1} alignItems="center" paddingTop="l">
      <Text variant="callout" color="gray600">
        {Constants.manifest?.name} v{Constants.manifest?.version}
      </Text>
    </Box>
  );
};

export default SettingsListFooter;
