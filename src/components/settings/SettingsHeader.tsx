import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import theme, { useTheme } from "../../utils/theme";
import { ArrowRight } from "react-native-feather";
import { Box, Text } from "../restyle";
import { useAuth } from "../../contexts/AuthContext";

export const SettingsHeader = () => {
  const theme = useTheme();
  const { logout } = useAuth();

  return (
    <Box alignItems="center">
      <Text variant="headline">Anonymous User</Text>
      <Text variant="callout" color="gray600" paddingTop="xxs">
        Login to save your data on all your device
      </Text>
      <Box paddingTop="m" paddingBottom="xl">
        <TouchableOpacity style={styles.btn} onPress={logout}>
          <Box flexDirection="row">
            <Text variant="headline" color="white">
              Logout
            </Text>
            <ArrowRight stroke={theme.colors.white} width={20} />
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
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
