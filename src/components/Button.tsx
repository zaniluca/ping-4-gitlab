import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import React from "react";
import { Theme } from "../utils/theme";
import { useTheme } from "@shopify/restyle";
import { Text } from "./restyle";

type Props = {
  onPress: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
};

const Button: React.FC<Props> = ({ onPress, title, style, children }) => {
  const { fontFamily, colors } = useTheme<Theme>();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.button, style, { backgroundColor: colors.indigo }]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { fontFamily: fontFamily.semibold, color: colors.white },
        ]}
      >
        {title ? title : children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
});
