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
          <AtSign stroke={theme.colors.purpleLight} width={20} />
        </View>
        <View style={{ flexShrink: 1 }}>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View style={{ flexShrink: 1, paddingEnd: 2 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={styles.headline}
              >
                {"kampaay/kampaay-storefront #320"}
              </Text>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
                {item.title}
              </Text>
            </View>
            <Text style={styles.time}>1h</Text>
          </View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.body}>
            {item.body}
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
  headline: {
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
