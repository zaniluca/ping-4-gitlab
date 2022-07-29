import React from "react";
import { TouchableOpacity } from "react-native";
import { ArrowRight } from "react-native-feather";

import { useRootStackNavigation } from "../../navigation/RootStackNavigator";
import { useUser } from "../../hooks/user-hooks";
import { useTheme } from "../../utils/theme";
import { Box, Text } from "../restyle";

export const SettingsHeader = () => {
  const navigation = useRootStackNavigation();
  const theme = useTheme();
  const user = useUser();

  return (
    <Box alignItems="center" paddingVertical="xxl">
      <Text variant="headline">
        {user.isAnonymous ? "Anonymous User" : "You're logged in"}
      </Text>
      <Text variant="callout" color="secondary" paddingTop="xxs">
        {user.isAnonymous
          ? "Signup to save data between devices"
          : `with ${user.data?.email}`}
      </Text>
      {user.isAnonymous && (
        <Box paddingTop="m">
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Box
              flexDirection="row"
              width={140}
              backgroundColor="indigo"
              alignItems="center"
              justifyContent="center"
              paddingVertical="s"
              paddingHorizontal="m"
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
