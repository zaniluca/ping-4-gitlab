import React from "react";
import { ListRenderItem, SectionList, SectionListData } from "react-native";
import { useTheme } from "../../utils/theme";
import { Box, Text } from "../restyle";

type SectionItem = {
  key: any;
  view: JSX.Element;
};

type SettingsSections = {
  title?: string;
  data: SectionItem[];
};

type SectionHeaderProps = {
  section: SectionListData<SectionItem>;
};

const Test = () => {
  return <Text>Hi!</Text>;
};

const SettingsSectionedList = () => {
  const { colors, fontFamily } = useTheme();

  const SETTINGS_SECTIONS: SettingsSections[] = [
    {
      data: [
        {
          key: "dsdad",
          view: <Test />,
        },
      ],
    },
  ];

  const renderSectionHeader = ({ section: { title } }: SectionHeaderProps) => {
    return (
      <Box padding="s" backgroundColor="quaternary">
        {title && (
          <Text
            variant="callout"
            fontFamily={fontFamily.semibold}
            textTransform="uppercase"
            paddingHorizontal="l"
            letterSpacing={1.5}
          >
            {title}
          </Text>
        )}
      </Box>
    );
  };

  const renderItem: ListRenderItem<SectionItem> = ({ item }) => {
    const { view } = item;
    return (
      <Box
        flexDirection="row"
        justifyContent="space-between"
        padding="m"
        backgroundColor="white"
      >
        {view}
      </Box>
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
      keyExtractor={(item) => item.key}
    />
  );
};

export default SettingsSectionedList;
