import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box, Text } from "../../components/restyle";
import SettingsSectionedList, {
  SettingsSettingsSections,
} from "../../components/settings/SettingsSectionedList";
import { useAuth } from "../../contexts/AuthContext";
import { RootStackScreenProps } from "../../navigation/types";

const DeleteAccount = () => {
  const { logout, deleteUser } = useAuth();

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
            await logout();
            await deleteUser();
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
  const SECTIONS: SettingsSettingsSections[] = [
    {
      data: [
        {
          key: "delete-account",
          content: <DeleteAccount />,
        },
      ],
    },
  ];

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
