import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import theme from "../utils/theme";
import { ArrowLeft } from "react-native-feather";

const BackButton = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <ArrowLeft stroke={theme.colors.gray900} />
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  text: {
    marginLeft: 4,
    fontFamily: theme.fonts.sourceSansPro.semibold,
    fontSize: 17,
    color: theme.colors.gray900,
  },
});
