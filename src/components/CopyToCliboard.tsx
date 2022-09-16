import { SpacingProps } from "@shopify/restyle";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Copy } from "react-native-feather";
import Toast from "react-native-toast-message";

import { Theme, useTheme } from "../utils/theme";
import { Box, Text } from "./restyle";

type Props = SpacingProps<Theme> & {
  content: string;
};

const CopyToCliboard: React.FC<Props> = ({ content, ...rest }) => {
  const theme = useTheme();

  const handleOnPress = async () => {
    Toast.show({
      text1: "Copied!",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Clipboard.setStringAsync(content);
  };

  return (
    <Box {...rest}>
      <TouchableOpacity onPress={handleOnPress} activeOpacity={0.5}>
        <Box
          style={{ paddingVertical: 12 }}
          paddingHorizontal="m"
          backgroundColor="quaternary"
          borderRadius={4}
          flexDirection="row"
          justifyContent="space-between"
        >
          <Text variant="headline">{content}</Text>
          <Copy stroke={theme.colors.secondary} />
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default CopyToCliboard;
