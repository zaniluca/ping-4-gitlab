import React, { useState } from "react";
import { TextInput, StyleSheet, TextInputProps, StyleProp } from "react-native";

import { Text, Box } from "./restyle";
import lightTheme, { useTheme } from "../utils/theme";

type Props = TextInputProps & {
  style?: StyleProp<any>;
  error?: string;
  label?: string;
};

const Input: React.FC<Props> = ({ style, error, label, ...props }) => {
  const { colors, textVariants } = useTheme();
  const [focused, setFocused] = useState(false);

  const getLabelColor = () => {
    if (error) {
      return colors.red;
    }

    if (focused) {
      return colors.purple;
    } else {
      return colors.secondary;
    }
  };

  const getPlaceholderColor = () => {
    // Specifying opacity with "+60"
    if (error) {
      return colors.red + "60";
    }

    if (focused) {
      return colors.purple + "60";
    } else {
      return colors.secondary + "60";
    }
  };

  const getTextColor = () => {
    if (error) {
      return colors.red;
    }

    if (focused) {
      return colors.purple;
    } else {
      return colors.primary;
    }
  };

  const getBorderColor = () => {
    if (error) {
      return colors.red;
    }

    if (focused) {
      return colors.purple;
    } else {
      return "transparent";
    }
  };

  return (
    <Box style={style}>
      <Box
        style={[
          styles.wrapper,
          { borderColor: getBorderColor() },
          { backgroundColor: colors.quaternary },
        ]}
      >
        {label && (
          <Box style={styles.labelWrapper}>
            <Text
              variant="body"
              textTransform="capitalize"
              numberOfLines={1}
              style={{ color: getLabelColor() }}
            >
              {label}
            </Text>
          </Box>
        )}
        <Box style={styles.inputWrapper}>
          <TextInput
            {...props}
            style={[textVariants.headline, { color: getTextColor() }]}
            placeholderTextColor={getPlaceholderColor()}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  labelWrapper: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 80,
  },
  inputWrapper: {
    paddingLeft: 12,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
  },
  textInput: {
    flex: 1,
    width: "100%",
    backgroundColor: lightTheme.colors.quaternary,
  },
});
