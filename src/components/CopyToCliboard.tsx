import React from "react";
import { Box, Text } from "./restyle";
import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native";
import { Copy } from "react-native-feather";
import { useTheme } from "../utils/theme";

type Props = {
  content: string;
};

const CopyToCliboard: React.FC<Props> = ({ content }) => {
  const theme = useTheme();

  return (
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
  );
};

export default CopyToCliboard;
