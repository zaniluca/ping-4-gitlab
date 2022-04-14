import { TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "../utils/theme";
import { ArrowLeft } from "react-native-feather";
import { Box, Text } from "./restyle";
import { useRootStackNavigation } from "../navigation/RootStackNavigator";

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
        <ArrowLeft stroke={colors.gray900} />
        <Text marginLeft="s" variant="headline">
          Back
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default BackButton;
