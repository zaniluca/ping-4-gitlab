import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import theme, { useTheme } from "../../utils/theme";
import { ArrowRight } from "react-native-feather";
import { Box, Text } from "../restyle";

export const SettingsHeader = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="headline">Anonymous User</Text>
      <Text variant="callout" color="gray600" paddingTop="xxs">
        Login to save your data on all your device
      </Text>
      <View
        style={{
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        <TouchableOpacity style={styles.btn}>
          <Box flexDirection="row">
            <Text variant="headline" color="white">
              Login
            </Text>
            <ArrowRight stroke={theme.colors.white} width={20} />
          </Box>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  btn: {
    width: 140,
    backgroundColor: theme.colors.purple,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
});
