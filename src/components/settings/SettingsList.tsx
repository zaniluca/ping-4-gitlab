import {
  ListRenderItem,
  SectionList,
  SectionListData,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { ChevronRight, LogOut, User } from "react-native-feather";
import { useTheme } from "../../utils/theme";
import { SvgProps } from "react-native-svg";
import SettingsListFooter from "./SettingsListFooter";
import { Box, Text } from "../restyle";
import { useAuth } from "../../contexts/AuthContext";
import { useRootStackNavigation } from "../../navigation/RootStackNavigator";

type SectionItem = {
  name: string;
  icon: (props: SvgProps) => JSX.Element;
  onPress?: () => void;
  showChevron: boolean;
};

type SettingsSections = {
  title: string;
  data: SectionItem[];
};

type SectionHeaderProps = {
  section: SectionListData<SectionItem>;
};

const SettingsList = () => {
  const { colors, fontFamily } = useTheme();
  const { logout, user } = useAuth();
  const navigation = useRootStackNavigation();

  const SETTINGS_SECTIONS: SettingsSections[] = [
    {
      title: "General",
      data: [
        {
          name: "Account",
          icon: (props: SvgProps) => <User {...props} />,
          onPress: () => navigation.navigate("AccountSettings"),
          showChevron: true,
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
                showChevron: false,
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
    const { name, onPress, showChevron } = item;
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          padding="m"
          backgroundColor="white"
        >
          <Box flexDirection="row">
            <Box paddingRight="m">
              <item.icon stroke={colors.primary} strokeWidth={2} />
            </Box>
            <Text variant="headline">{name}</Text>
          </Box>
          {showChevron && <ChevronRight stroke={colors.primary} />}
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
