import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AtSign, Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListSeparator } from "../components/ListSeparator";
import { RootStackParamList } from "../navigation/types";
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

type Props = NativeStackScreenProps<RootStackParamList, "Inbox">;

export default function InboxScreen({ navigation }: Props) {
  React.useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search for notifications",
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Settings stroke={theme.colors.gray600} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              navigation.navigate("NotificationDetail", { ...item })
            }
          >
            <View style={styles.row}>
              <View style={styles.listIcon}>
                <AtSign stroke={theme.colors.purpleDark} width={20} />
              </View>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(item) => item.title}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  listIcon: {
    paddingRight: 8,
  },
  title: {
    fontSize: 17,
    color: theme.colors.gray900,
    fontFamily: theme.fonts.sourceSansPro.regular,
  },
  body: {
    paddingTop: 2,
    fontSize: 15,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.sourceSansPro.regular,
  },
});
