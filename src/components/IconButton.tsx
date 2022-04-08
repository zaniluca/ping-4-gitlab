import { TouchableOpacity } from "react-native";
import React from "react";
import { Box } from "./restyle";

type Props = {
  onPress: () => void;
};

const IconButton: React.FC<Props> = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box padding="s">{children}</Box>
    </TouchableOpacity>
  );
};

export default IconButton;
