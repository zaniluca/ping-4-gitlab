import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { WebView } from "react-native-webview";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationDetail">;

const NotificationDetail: React.FC<Props> = ({ navigation, route }) => {
  return (
    <WebView
      source={{
        html: route.params.html ?? "",
      }}
      textZoom={125}
    />
  );
};

export default NotificationDetail;
