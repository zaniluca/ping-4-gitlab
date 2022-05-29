import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";
import SettingsSectionedList, {
  SettingsSettingsSections,
} from "../../components/settings/SettingsSectionedList";
import { Box, Text } from "../../components/restyle";

const DeleteAccount = () => {
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
          onPress: () => console.log("Delete account"),
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
          view: <DeleteAccount />,
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
