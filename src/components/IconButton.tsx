import { TouchableOpacity } from "react-native";
import React from "react";

type Props = {
  onPress: () => void;
};

const IconButton: React.FC<Props> = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 4,
      }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default IconButton;
