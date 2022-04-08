import React from "react";
import { StyleSheet, View } from "react-native";

export function ListSeparator(): React.ReactElement {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#D2D2D2",
    height: 1,
    marginLeft: 40,
    opacity: 0.4,
  },
});
