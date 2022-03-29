import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  Text,
} from "react-native";
import theme from "../utils/theme";

type Props = TextInputProps & {
  style?: StyleProp<any>;
  error?: string;
  label?: string;
};

const Input: React.FC<Props> = ({ style, error, label, ...props }) => {
  const [focused, setFocused] = React.useState(false);

  const getLabelColor = () => {
    if (error) {
      return "red";
    }

    if (focused) {
      return theme.colors.purpleLight;
    } else {
      return theme.colors.gray600;
    }
  };

  const getPlaceholderColor = () => {
    // Specifying opacity with "+60"
    if (error) {
      return "#ff0000" + "60";
    }

    if (focused) {
      return theme.colors.purpleLight + "60";
    } else {
      return undefined;
    }
  };

  const getTextColor = () => {
    if (error) {
      return "red";
    }

    if (focused) {
      return theme.colors.purpleLight;
    } else {
      return theme.colors.gray900;
    }
  };

  const getBorderColor = () => {
    if (error) {
      return "red";
    }

    if (focused) {
      return theme.colors.purpleLight;
    } else {
      return "transparent";
    }
  };

  return (
    <View style={style}>
      <View style={[styles.wrapper, { borderColor: getBorderColor() }]}>
        {label && (
          <View style={styles.labelWrapper}>
            <Text style={[styles.label, { color: getLabelColor() }]}>
              {label}
            </Text>
          </View>
        )}
        <View style={styles.inputWrapper}>
          <TextInput
            {...props}
            style={[styles.textInput, { color: getTextColor() }]}
            placeholderTextColor={getPlaceholderColor()}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
          />
        </View>
      </View>
    </View>
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
  label: {
    fontFamily: theme.fonts.sourceSansPro.regular,
    fontSize: 17,
    textTransform: "capitalize",
  },
  textInput: {
    flex: 1,
    width: "100%",
    fontFamily: theme.fonts.sourceSansPro.semibold,
    fontSize: 17,
    color: theme.colors.gray900,
    backgroundColor: theme.colors.gray100,
  },
});
