import { TouchableOpacity } from "react-native";
import React from "react";
import { Theme } from "../utils/theme";
import { ArrowLeft } from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useTheme } from "@shopify/restyle";
import { Box, Text } from "./restyle";

const BackButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme<Theme>();

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
