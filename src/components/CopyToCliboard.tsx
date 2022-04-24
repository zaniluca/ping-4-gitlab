import React from "react";
import { Box, Text } from "./restyle";
import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native";
import { Copy } from "react-native-feather";
import { Theme, useTheme } from "../utils/theme";
import { SpacingProps } from "@shopify/restyle";

type Props = SpacingProps<Theme> & {
  content: string;
};

const CopyToCliboard: React.FC<Props> = ({ content, ...rest }) => {
  const theme = useTheme();

  return (
    <Box {...rest}>
      <TouchableOpacity
        onPress={() => Clipboard.setString(content)}
        activeOpacity={0.8}
      >
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
