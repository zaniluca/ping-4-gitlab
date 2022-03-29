import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import React from "react";

const KeyboardAvoid: React.FC = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Not Working with nested Touchable so i have to remove the dismiss on tap */}
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <>{children}</>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
