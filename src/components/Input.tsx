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

  // const getFlexDirection = () => {
  //   if (icon && iconPosition) {
  //     if (iconPosition === 'left') {
  //       return 'row';
  //     } else if (iconPosition === 'right') {
  //       return 'row-reverse';
  //     }
  //   }
  // };

  // const getBorderColor = () => {
  //   if (error) {
  //     return colors.danger;
  //   }

  //   if (focused) {
  //     return colors.primary;
  //   } else {
  //     return colors.grey;
  //   }
  // };
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.wrapper, { borderColor: "transparent" }]}>
        {label && (
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
        <View style={styles.inputWrapper}>
          <TextInput
            {...props}
            style={styles.textInput}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
          />
        </View>
      </View>

      {/* {error && <Text style={styles.error}>{error}</Text>} */}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 12,
    // backgroundColor: "red",
  },
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
    color: theme.colors.gray600,
    textTransform: "capitalize",
  },
  textInput: {
    flex: 1,
    width: "100%",
    fontFamily: theme.fonts.sourceSansPro.semibold,
    fontSize: 17,
    color: theme.colors.gray900,
    // paddingVertical: 16,
    backgroundColor: theme.colors.gray100,
    // borderRadius: 4,
  },

  // error: {
  //   color: "red",
  //   paddingTop: 4,
  //   fontSize: 12,
  // },
});
