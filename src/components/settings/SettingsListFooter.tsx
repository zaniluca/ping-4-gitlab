import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function SettingsListFooter() {
  return (
    <View style={styles.container}>
      <Text>Footer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 32 },
});
