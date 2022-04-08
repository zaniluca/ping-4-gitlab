import React from "react";
import { Text } from "./restyle";

const Hint: React.FC = ({ children }) => {
  return (
    <Text variant="caption" color="gray600">
      {children}
    </Text>
  );
};

export default Hint;
