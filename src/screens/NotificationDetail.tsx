import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationDetail">;

export default function NotificationDetail({ route, navigation }: Props) {
  return (
    <View>
      <Text>{route.params.subject}</Text>
      <Text>{route.params.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
