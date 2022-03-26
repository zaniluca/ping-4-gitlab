import React from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#D2D2D2",
    height: 1,
    marginLeft: 10,
    opacity: 0.4,
  },
});

export function ListSeparator(): React.ReactElement {
  return <View style={styles.separator} />;
}
