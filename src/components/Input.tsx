import { useTheme } from "@shopify/restyle";
import React from "react";
import { TextInput, StyleSheet, TextInputProps, StyleProp } from "react-native";
import theme, { Theme } from "../utils/theme";
import { Text, Box } from "./restyle";

type Props = TextInputProps & {
  style?: StyleProp<any>;
  error?: string;
  label?: string;
};

const Input: React.FC<Props> = ({ style, error, label, ...props }) => {
  const { colors, textVariants } = useTheme<Theme>();
  const [focused, setFocused] = React.useState(false);

  const getLabelColor = () => {
    if (error) {
      return colors.red;
    }

    if (focused) {
      return colors.purple;
    } else {
      return colors.gray600;
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
      return colors.gray600 + "60";
    }
  };

  const getTextColor = () => {
    if (error) {
      return colors.red;
    }

    if (focused) {
      return colors.purple;
    } else {
      return colors.gray900;
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
      <Box style={[styles.wrapper, { borderColor: getBorderColor() }]}>
        {label && (
          <Box style={styles.labelWrapper}>
            <Text
              variant="body"
              textTransform="capitalize"
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
    backgroundColor: theme.colors.gray100,
  },
  labelWrapper: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 70,
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
    backgroundColor: theme.colors.gray100,
  },
});
