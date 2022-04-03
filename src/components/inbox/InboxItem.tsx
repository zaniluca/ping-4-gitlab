import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import theme from "../../utils/theme";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Notification } from "../../utils/types";
import { parseHeaders } from "../../utils/parse-headers";
import InboxItemIcon from "./InboxItemIcon";

type Props = {
  item: Notification;
};

const InboxItem: React.FC<Props> = ({ item }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const headers = parseHeaders(item.headers);

  const NotificationIcon = () => {};

  const iid = headers["x-gitlab-issue-iid"];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("NotificationDetail", item)}
    >
      <View style={styles.row}>
        <View style={styles.icon}>
          <InboxItemIcon headers={headers} width={20} />
        </View>
        <View style={{ flexShrink: 1 }}>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View
              style={{
                flexShrink: 1,
                paddingEnd: 2,
                justifyContent: "space-between",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={styles.project}
              >
                {headers["x-gitlab-project-path"] + " #" + iid}
              </Text>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
                {item.subject}
              </Text>
            </View>
            <Text style={styles.time}>1h</Text>
          </View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.body}>
            {item.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InboxItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  container: {
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  icon: {
    paddingRight: 8,
  },
  project: {
    fontSize: 16,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.sourceSansPro.regular,
    flexShrink: 1,
  },
  title: {
    fontSize: 17,
    color: theme.colors.gray900,
    fontFamily: theme.fonts.sourceSansPro.semibold,
    flexShrink: 1,
  },
  body: {
    paddingTop: 2,
    fontSize: 16,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.sourceSansPro.regular,
  },
  time: {
    fontSize: 16,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.sourceSansPro.regular,
  },
});
