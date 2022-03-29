import { Text } from "react-native";
import React from "react";
import theme from "../utils/theme";

const Hint: React.FC = ({ children }) => {
  return (
    <Text
      style={{
        marginTop: 8,
        fontFamily: theme.fonts.sourceSansPro.regular,
        fontSize: 12,
        color: theme.colors.gray600,
      }}
    >
      {children}
    </Text>
  );
};

export default Hint;
