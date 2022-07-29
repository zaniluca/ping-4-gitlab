import React from "react";
import {
  ListRenderItem,
  Platform,
  SectionList,
  SectionListData,
  Switch,
  TouchableOpacity,
} from "react-native";
import { BellOff, ChevronRight, LogOut, User } from "react-native-feather";
import { SvgProps } from "react-native-svg";
import Toast from "react-native-toast-message";

import { useData } from "../../contexts/DataContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import { useRootStackNavigation } from "../../navigation/RootStackNavigator";
import { useTheme } from "../../utils/theme";
import { Box, Text } from "../restyle";
import SettingsListFooter from "./SettingsListFooter";
import { useLogout } from "../../hooks/auth-hooks";
import { useUpdateUser, useUser } from "../../hooks/user-hooks";

type SectionItem = {
  name: string;
  icon: (props: SvgProps) => JSX.Element;
  onPress?: () => void;
  right?: JSX.Element;
};

type SettingsSections = {
  title: string;
  data: SectionItem[];
};

type SectionHeaderProps = {
  section: SectionListData<SectionItem>;
};

const PauseNotificationsSwitch = () => {
  const { userData, updateUserData } = useData();
  const { colors } = useTheme();

  const togglePauseNotifications = async () => {
    const newValue = !userData?.hasDisabledNotifications;
    await updateUserData({
      hasDisabledNotifications: newValue,
    });

    Toast.show({
      text1: `Notifications ${newValue ? "Paused" : "Resumed"}`,
    });
  };

  return (
    <Switch
      trackColor={{
        true: Platform.OS === "android" ? `${colors.orange}60` : colors.orange,
      }}
      thumbColor={
        Platform.OS === "android"
          ? userData?.hasDisabledNotifications
            ? colors.orange
            : colors.primary
          : undefined
      }
      onChange={togglePauseNotifications}
      value={userData?.hasDisabledNotifications}
    />
  );
};

const SettingsList = () => {
  const { colors, fontFamily } = useTheme();
  const { pushToken } = useNotifications();
  const navigation = useRootStackNavigation();
  const updateUser = useUpdateUser();
  const user = useUser();
  const logout = useLogout();

  const handleLogout = async () => {
    await updateUser.mutateAsync({
      expoPushTokens: user.data?.expoPushTokens?.filter((t) => t !== pushToken),
    });
    await logout();
  };

  const SETTINGS_SECTIONS: SettingsSections[] = [
    {
      title: "General",
      data: [
        ...(!user.isAnonymous
          ? [
              {
                name: "Pause Notifications",
                icon: (props: SvgProps) => <BellOff {...props} />,
                right: <PauseNotificationsSwitch />,
              },
            ]
          : []),
        {
          name: "Account",
          icon: (props: SvgProps) => <User {...props} />,
          onPress: () => navigation.navigate("AccountSettings"),
          right: <ChevronRight stroke={colors.primary} />,
        },
      ],
    },
    ...(!user.isAnonymous
      ? [
          {
            title: "",
            data: [
              {
                name: "Logout",
                icon: (props: SvgProps) => <LogOut {...props} />,
                onPress: handleLogout,
                right: <ChevronRight stroke={colors.primary} />,
              },
            ],
          },
        ]
      : []),
  ];

  const renderSectionHeader = ({ section }: SectionHeaderProps) => {
    return (
      <Box padding="s" backgroundColor="quaternary">
        <Text
          variant="callout"
          fontFamily={fontFamily.semibold}
          textTransform="uppercase"
          paddingHorizontal="l"
          letterSpacing={1.5}
        >
          {section.title}
        </Text>
      </Box>
    );
  };

  const renderItem: ListRenderItem<SectionItem> = ({ item }) => {
    const { name, onPress, right } = item;
    return (
      <TouchableOpacity activeOpacity={onPress ? 0.6 : 1} onPress={onPress}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding="m"
          backgroundColor="primaryBackground"
        >
          <Box flexDirection="row">
            <Box paddingRight="m">
              <item.icon stroke={colors.primary} strokeWidth={2} />
            </Box>
            <Text variant="headline">{name}</Text>
          </Box>
          {right}
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <SectionList
      style={{ backgroundColor: colors.quaternary }}
      scrollEnabled={false}
      stickySectionHeadersEnabled={false}
      contentInsetAdjustmentBehavior="automatic"
      sections={SETTINGS_SECTIONS}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item, index) => index + item.name}
      ListFooterComponent={SettingsListFooter}
    />
  );
};

export default SettingsList;
