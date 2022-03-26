import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AtSign, ChevronRight, Clock, Heart } from "react-native-feather";
import theme from "../utils/theme";
import { SvgProps } from "react-native-svg";
import SettingsListFooter from "../components/settings/SettingsListFooter";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

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

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export default function SettingsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        scrollEnabled={false}
        stickySectionHeadersEnabled={false}
        contentInsetAdjustmentBehavior="automatic"
        sections={SETTINGS_SECTIONS}
        renderItem={({ item }) => (
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
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index + item.name}
        ListFooterComponent={SettingsListFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 8,
    backgroundColor: "#f2f2f2",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    textTransform: "uppercase",
    color: theme.colors.gray600,
    fontFamily: theme.fonts.sourceSansPro.semibold,
    letterSpacing: 1.5,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
