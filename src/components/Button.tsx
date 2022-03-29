import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import React from "react";
import theme from "../utils/theme";

type Props = {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
};

const Button: React.FC<Props> = ({ onPress, title, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
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
    backgroundColor: theme.colors.purpleLight,
  },
  text: {
    fontSize: 18,
    lineHeight: 21,
    fontFamily: theme.fonts.sourceSansPro.semibold,
    letterSpacing: 0.25,
    color: "white",
  },
});
