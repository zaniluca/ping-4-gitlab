import type { FC, ReactElement } from "react";
import { ListRenderItem, SectionList, SectionListData } from "react-native";

import { useTheme } from "../../utils/theme";
import { Box, Text } from "../restyle";

export type SettingsSectionItem = {
  key: string;
  content: ReactElement;
  footer?: ReactElement;
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

const SettingsSectionedList: FC<Props> = ({ sections }) => {
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
            paddingHorizontal="xl"
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
          padding="l"
          backgroundColor="primaryBackground"
        >
          {content}
        </Box>
        {footer && (
          <Box marginTop="xs" marginHorizontal="l">
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
