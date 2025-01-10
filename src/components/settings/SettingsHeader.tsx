import React from "react";
import { TouchableOpacity } from "react-native";
import { ArrowRight } from "react-native-feather";

import { useRootStackNavigation } from "../../hooks/navigation-hooks";
import { useUser } from "../../hooks/user-hooks";
import { useTheme } from "../../utils/theme";
import { Box, Text } from "../restyle";

export const SettingsHeader = () => {
  const navigation = useRootStackNavigation();
  const theme = useTheme();
  const user = useUser();

  return (
    <Box alignItems="center" paddingVertical="4xl">
      <Text variant="headline">
        {user.isAnonymous ? "Anonymous User" : "You're logged in"}
      </Text>
      <Text variant="callout" color="secondary" paddingTop="2xs">
        {user.isAnonymous
          ? "Signup to save data between devices"
          : `with ${user.data?.email}`}
      </Text>
      {user.isAnonymous && (
        <Box paddingTop="l">
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Box
              flexDirection="row"
              width={140}
              backgroundColor="indigo"
              alignItems="center"
              justifyContent="center"
              paddingVertical="s"
              paddingHorizontal="l"
              borderRadius={100}
            >
              <Text variant="headline" color="white">
                Signup
              </Text>
              <ArrowRight stroke={theme.colors.white} width={20} />
            </Box>
          </TouchableOpacity>
        </Box>
      )}
    </Box>
  );
};

export default SettingsHeader;
