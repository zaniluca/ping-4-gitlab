import { StyleSheet } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { WebView } from "react-native-webview";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationDetail">;

export default function NotificationDetail({ route, navigation }: Props) {
  const source = {
    html: route.params.html ?? "",
  };

  return <WebView source={source} textZoom={125} />;
}

const styles = StyleSheet.create({});
