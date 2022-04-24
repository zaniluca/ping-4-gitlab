import React from "react";
import { Box, Text } from "./restyle";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { TouchableOpacity } from "react-native";
import { Copy } from "react-native-feather";
import { Theme, useTheme } from "../utils/theme";
import { SpacingProps } from "@shopify/restyle";
import Toast from "react-native-toast-message";

type Props = SpacingProps<Theme> & {
  content: string;
};

const CopyToCliboard: React.FC<Props> = ({ content, ...rest }) => {
  const theme = useTheme();

  const handleOnPress = () => {
    Toast.show({
      text1: "Copied!",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Clipboard.setString(content);
  };

  return (
    <Box {...rest}>
      <TouchableOpacity onPress={handleOnPress} activeOpacity={0.5}>
        <Box
          style={{ paddingVertical: 12 }}
          paddingHorizontal="m"
          backgroundColor="gray100"
          borderRadius={4}
          flexDirection="row"
          justifyContent="space-between"
        >
          <Text variant="headline">{content}</Text>
          <Copy stroke={theme.colors.gray600} />
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default CopyToCliboard;
