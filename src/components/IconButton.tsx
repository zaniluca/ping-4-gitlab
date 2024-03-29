import React, { PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";

import { Box } from "./restyle";

type Props = PropsWithChildren & {
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
