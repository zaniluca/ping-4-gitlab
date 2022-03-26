import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SectionList,
  FlatList,
} from "react-native";
import { GitCommit } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListSeparator } from "../components/ListSeparator";
import theme from "../utils/theme";

const data = [
  {
    title: "Devin",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Dan",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Dominic",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Jackson",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "James",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Joel",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "John",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Jillian",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Jimmy",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Julie",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.row}>
                {/* <View style={styles.listIcon}>
                  <GitCommit stroke={theme.colors.purpleDark} />
                </View> */}
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.body}>{item.body}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          // renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item) => item.title}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  listIcon: {
    paddingRight: 8,
  },
  title: {
    fontSize: 17,
    color: theme.colors.gray900,
  },
  body: {
    fontSize: 15,
    color: theme.colors.gray600,
  },
});
