import React from "react";
import { ListRenderItem, SectionList, SectionListData } from "react-native";

import { useTheme } from "../../utils/theme";
import { Box, Text } from "../restyle";

export type SettingsSectionItem = {
  key: any;
  content: JSX.Element;
  footer?: JSX.Element;
};

export type SettingsSettingsSections = {
  title?: string;
  data: SettingsSectionItem[];
};

type SettingsSectionHeaderProps = {
  section: SectionListData<SettingsSectionItem>;
};

type Props = {
  sections: SettingsSettingsSections[];
};

const SettingsSectionedList: React.FC<Props> = ({ sections }) => {
  const { colors, fontFamily } = useTheme();

  const renderSectionHeader = ({
    section: { title },
  }: SettingsSectionHeaderProps) => {
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

  const renderItem: ListRenderItem<SettingsSectionItem> = ({ item }) => {
    const { content, footer } = item;
    return (
      <>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          padding="m"
          backgroundColor="primaryBackground"
        >
          {content}
        </Box>
        {footer && (
          <Box marginTop="xs" marginHorizontal="m">
            {footer}
          </Box>
        )}
      </>
    );
  };

  return (
    <SectionList
      style={{ backgroundColor: colors.quaternary }}
      scrollEnabled={false}
      stickySectionHeadersEnabled={false}
      contentInsetAdjustmentBehavior="automatic"
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item) => item.key}
    />
  );
};

export default SettingsSectionedList;
