import React, { useMemo } from "react";
import { Alert, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box, Text } from "../../components/restyle";
import SettingsSectionedList, {
  SettingsSettingsSections,
} from "../../components/settings/SettingsSectionedList";
import { useGitlabLogin, useLogout } from "../../hooks/auth-hooks";
import { useDeleteUser, useUser } from "../../hooks/user-hooks";
import { RootStackScreenProps } from "../../navigation/types";

const ConnectGitlab = () => {
  const loginWithGitlab = useGitlabLogin();

  return (
    <Box flex={1}>
      <TouchableOpacity activeOpacity={0.6} onPress={loginWithGitlab}>
        <Text variant="headline">Connect Gitlab account</Text>
      </TouchableOpacity>
    </Box>
  );
};
const DeleteAccount = () => {
  const deleteUser = useDeleteUser();
  const logout = useLogout();

  const handlePress = () => {
    Alert.alert(
      "Attention!",
      "You're trying to delete your account, this action is permanent and can't be undone, if you wish to proceed all your data will be deleted permanently",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Proceed",
          style: "destructive",
          onPress: async () => {
            await deleteUser.mutateAsync();
            await logout();
          },
        },
      ]
    );
  };

  return (
    <Box flex={1}>
      <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
        <Text variant="headline" color="red">
          Delete account
        </Text>
      </TouchableOpacity>
    </Box>
  );
};

type Props = RootStackScreenProps<"AccountSettings">;

const AccountSettingsScreen: React.FC<Props> = () => {
  const user = useUser();

  const SECTIONS: SettingsSettingsSections[] = useMemo(
    () => [
      {
        data:
          user.data?.gitlabId || Platform.OS === "android" // TODO: remove this when we have a way to login with Gitlab on Android
            ? []
            : [
                {
                  key: "connect-gitlab",
                  content: <ConnectGitlab />,
                  footer: (
                    <Text variant="caption" color="secondary">
                      Connect your Gitlab account to more easily login to the
                      app
                    </Text>
                  ),
                },
              ],
      },
      {
        data: [
          {
            key: "delete-account",
            content: <DeleteAccount />,
          },
        ],
      },
    ],
    [user.data?.gitlabId]
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <SettingsSectionedList sections={SECTIONS} />
    </SafeAreaView>
  );
};

export default AccountSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
