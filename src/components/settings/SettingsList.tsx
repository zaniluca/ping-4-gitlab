import {
  ListRenderItem,
  SectionList,
  SectionListData,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { AtSign, ChevronRight, Clock, Heart } from "react-native-feather";
import { Theme } from "../../utils/theme";
import { SvgProps } from "react-native-svg";
import SettingsListFooter from "./SettingsListFooter";
import { useTheme } from "@shopify/restyle";
import { Box, Text } from "../restyle";

const SETTINGS_SECTIONS: any[] = [
  // {
  //   title: "Content",
  //   data: [
  //     {
  //       name: "Favourites",
  //       icon: (props: SvgProps) => <Heart {...props} />,
  //     },
  //     {
  //       name: "Work Hours",
  //       icon: (props: SvgProps) => <Clock {...props} />,
  //     },
  //   ],
  // },
  // {
  //   title: "Content",
  //   data: [
  //     {
  //       name: "Name",
  //       icon: (props: SvgProps) => <AtSign {...props} />,
  //     },
  //     {
  //       name: "Name",
  //       icon: (props: SvgProps) => <AtSign {...props} />,
  //     },
  //     {
  //       name: "Name",
  //       icon: (props: SvgProps) => <AtSign {...props} />,
  //     },
  //   ],
  // },
];

type SectionItem = {
  name: string;
  icon: (props: SvgProps) => JSX.Element;
};

type SectionHeaderProps = {
  section: SectionListData<SectionItem>;
};

const SettingsList = () => {
  const { colors, fontFamily } = useTheme<Theme>();

  const renderSectionHeader = ({ section }: SectionHeaderProps) => {
    return (
      <Box padding="s" backgroundColor="gray100">
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

  const renderItem: ListRenderItem<SectionItem> = ({ item }) => (
    <TouchableOpacity>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        padding="m"
        backgroundColor="white"
      >
        <Box flexDirection="row">
          <Box paddingRight="m">
            <item.icon stroke={colors.gray900} strokeWidth={2} />
          </Box>
          <Text variant="headline">{item.name}</Text>
        </Box>
        <ChevronRight stroke={colors.gray900} />
      </Box>
    </TouchableOpacity>
  );

  return (
    <SectionList
      style={{ backgroundColor: colors.gray100 }}
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
