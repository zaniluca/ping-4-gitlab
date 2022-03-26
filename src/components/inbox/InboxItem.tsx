import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import theme from "../../utils/theme";
import { AtSign } from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  item: {
    title: string;
    body: string;
  };
};

const InboxItem: React.FC<Props> = ({ item }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("NotificationDetail", item)}
    >
      <View style={styles.row}>
        <View style={styles.icon}>
          <AtSign stroke={theme.colors.purpleDark} width={20} />
        </View>
        <View>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
              {item.title}
            </Text>
            <Text style={styles.time}>12:24</Text>
          </View>
          <Text numberOfLines={3} ellipsizeMode="tail" style={styles.body}>
            {item.body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InboxItem;

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  icon: {
    paddingRight: 8,
  },
  title: {
    fontSize: 17,
    color: theme.colors.gray900,
    fontFamily: theme.fonts.sourceSansPro.regular,
  },
  body: {
    paddingTop: 2,
    fontSize: 16,
    color: theme.colors.gray600,
    fontFamily: theme.fonts.sourceSansPro.regular,
  },
  time: {
    fontSize: 16,
    color: theme.colors.gray900,
    fontFamily: theme.fonts.sourceSansPro.semibold,
  },
});
