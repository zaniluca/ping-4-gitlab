import React from "react";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "react-native-feather";

import { useRootStackNavigation } from "../hooks/navigation-hooks";
import { useTheme } from "../utils/theme";
import { Box, Text } from "./restyle";

const BackButton = () => {
  const navigation = useRootStackNavigation();
  const { colors } = useTheme();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log("Can't go back");
    }
  };

  return (
    <TouchableOpacity onPress={handleGoBack}>
      <Box flexDirection="row" alignItems="center">
        <ArrowLeft stroke={colors.primary} />
        <Text marginLeft="s" variant="headline">
          Back
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default BackButton;
