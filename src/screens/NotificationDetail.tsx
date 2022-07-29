import React, { useEffect } from "react";
import { WebView } from "react-native-webview";

import { useData } from "../contexts/DataContext";
import { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"NotificationDetail">;

const NotificationDetail: React.FC<Props> = ({ route }) => {
  const { updateNotification } = useData();

  const notification = route.params;

  useEffect(() => {
    if (notification.viewed) return;
    updateNotification(notification.id, { viewed: true });
  }, []);

  return (
    <WebView
      source={{
        html: notification.html ?? "",
      }}
      textZoom={125}
    />
  );
};

export default NotificationDetail;
