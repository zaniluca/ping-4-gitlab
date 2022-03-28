import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";
import React from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const KeyboardAvoid: React.FC = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
