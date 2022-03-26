import {
  ListRenderItem,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AtSign, ChevronRight, Clock, Heart } from "react-native-feather";
import theme from "../../utils/theme";
import { SvgProps } from "react-native-svg";
import SettingsListFooter from "./SettingsListFooter";

const SETTINGS_SECTIONS = [
  {
    title: "Content",
    data: [
      {
        name: "Favourites",
        icon: (props: SvgProps) => <Heart {...props} />,
      },
      {
        name: "Work Hours",
        icon: (props: SvgProps) => <Clock {...props} />,
      },
    ],
  },
  {
    title: "Content",
    data: [
      {
        name: "Name",
        icon: (props: SvgProps) => <AtSign {...props} />,
      },
      {
        name: "Name",
        icon: (props: SvgProps) => <AtSign {...props} />,
      },
      {
        name: "Name",
        icon: (props: SvgProps) => <AtSign {...props} />,
      },
    ],
  },
];

type SectionItem = {
  name: string;
  icon: (props: SvgProps) => JSX.Element;
};

type SectionHeaderProps = {
  section: SectionListData<SectionItem>;
};

const renderSectionHeader = ({ section }: SectionHeaderProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>{section.title}</Text>
    </View>
  );
};

const renderItem: ListRenderItem<SectionItem> = ({ item }) => (
  <TouchableOpacity style={styles.listItem}>
    <View style={[styles.row, { justifyContent: "space-between" }]}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <item.icon stroke={theme.colors.gray900} strokeWidth={2} />
        </View>
        <Text style={styles.text}>{item.name}</Text>
      </View>
      <ChevronRight stroke={theme.colors.gray900} />
    </View>
  </TouchableOpacity>
);

export default function SettingsList() {
  return (
    <SectionList
      style={styles.list}
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
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: theme.colors.gray100,
  },
  section: {
    padding: 8,
    backgroundColor: theme.colors.gray100,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    textTransform: "uppercase",
    color: theme.colors.gray900,
    fontFamily: theme.fonts.sourceSansPro.semibold,
    letterSpacing: 1.5,
  },
  row: {
    flexDirection: "row",
  },
  listItem: {
    padding: 16,
    backgroundColor: "white",
  },
  icon: {
    paddingRight: 8,
  },
  text: {
    fontSize: 17,
    color: theme.colors.gray900,
    fontFamily: theme.fonts.sourceSansPro.semibold,
  },
  body: {
    paddingTop: 2,
    fontSize: 15,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.sourceSansPro.regular,
  },
});
