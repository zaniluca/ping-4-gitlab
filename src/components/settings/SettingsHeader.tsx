import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import theme from "../../utils/theme";
import { ArrowRight } from "react-native-feather";

export default function SettingsHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.primaryText}>Anonymous User</Text>
      <Text style={styles.secondaryText}>
        Login to save your data on all your device
      </Text>
      <View
        style={{
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        <TouchableOpacity style={[styles.btn, { width: 140 }]}>
          <View style={styles.row}>
            <Text style={styles.btnText}>Login</Text>
            <ArrowRight stroke={"white"} width={20} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  primaryText: {
    fontSize: 17,
    fontFamily: theme.fonts.sourceSansPro.semibold,
    color: theme.colors.gray900,
  },
  secondaryText: {
    paddingTop: 2,
    fontSize: 16,
    fontFamily: theme.fonts.sourceSansPro.regular,
    color: theme.colors.gray600,
  },
  row: {
    flexDirection: "row",
  },
  btn: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.purpleLight,
    borderRadius: 100,
  },
  btnText: {
    fontSize: 17,
    fontFamily: theme.fonts.sourceSansPro.semibold,
    color: "white",
  },
});
