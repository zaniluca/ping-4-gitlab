import { TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "../../utils/theme";
import { ArrowRight } from "react-native-feather";
import { Box, Text } from "../restyle";
import { useAuth } from "../../contexts/AuthContext";
import { useRootStackNavigation } from "../../navigation/RootStackNavigator";

export const SettingsHeader = () => {
  const navigation = useRootStackNavigation();
  const theme = useTheme();
  const { user } = useAuth();
  const isAnonymous = user?.isAnonymous;

  return (
    <Box alignItems="center" paddingVertical="xxl">
      <Text variant="headline">
        {isAnonymous ? "Anonymous User" : "You're logged in"}
      </Text>
      <Text variant="callout" color="gray600" paddingTop="xxs">
        {isAnonymous
          ? "Signup to save data between devices"
          : `with ${user?.email}`}
      </Text>
      {isAnonymous && (
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
