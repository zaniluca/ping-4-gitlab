import React from "react";
import { RootStackScreenProps } from "../navigation/types";
import { WebView } from "react-native-webview";

type Props = RootStackScreenProps<"NotificationDetail">;

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
