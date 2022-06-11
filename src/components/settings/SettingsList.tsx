import {
  ListRenderItem,
  SectionList,
  SectionListData,
  Switch,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { BellOff, ChevronRight, LogOut, User } from "react-native-feather";
import { useTheme } from "../../utils/theme";
import { SvgProps } from "react-native-svg";
import SettingsListFooter from "./SettingsListFooter";
import { Box, Text } from "../restyle";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import Toast from "react-native-toast-message";
import { useRootStackNavigation } from "../../navigation/RootStackNavigator";
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

const SettingsList = () => {
  const { userData, updateUserData } = useData();
  const { colors, fontFamily } = useTheme();
  const { logout, user } = useAuth();
  const navigation = useRootStackNavigation();

  const togglePauseNotifications = async () => {
    const newValue = !userData?.hasDisabledNotifications;
    await updateUserData({
      hasDisabledNotifications: newValue,
    });

    Toast.show({
      text1: `Notifications ${newValue ? "Paused" : "Resumed"}`,
    });
  };

  const SETTINGS_SECTIONS: SettingsSections[] = [
    {
      title: "General",
      data: [
        ...(!user?.isAnonymous
          ? [
              {
                name: "Pause Notifications",
                icon: (props: SvgProps) => <BellOff {...props} />,
                onPress: togglePauseNotifications,
                right: (
                  <Switch
                    trackColor={{ true: colors.orange }}
                    thumbColor={
                      userData?.hasDisabledNotifications ? "#f5dd4b" : "#f4f3f4"
                    }
                    onChange={togglePauseNotifications}
                    value={userData?.hasDisabledNotifications}
                  />
                ),
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
    ...(!user?.isAnonymous
      ? [
          {
            title: "",
            data: [
              {
                name: "Logout",
                icon: (props: SvgProps) => <LogOut {...props} />,
                onPress: logout,
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
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
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
