import React, { useEffect, useRef } from "react";
import { WebView } from "react-native-webview";

import { useData } from "../contexts/DataContext";
import { RootStackScreenProps } from "../navigation/types";
import { openUrl } from "../utils/open-url";

type Props = RootStackScreenProps<"NotificationDetail">;

const NotificationDetail: React.FC<Props> = ({ route }) => {
  const { updateNotification } = useData();
  const webview = useRef<WebView | null>(null);

  const notification = route.params;

  useEffect(() => {
    if (notification.viewed) return;
    updateNotification(notification.id, { viewed: true });
  }, []);

  return (
    <WebView
      ref={webview}
      source={{
        html: notification.html ?? "",
      }}
      textZoom={125}
      onNavigationStateChange={(e) => {
        if (e.url && e.url.startsWith("http")) {
          webview.current?.goBack();
          openUrl(e.url);
        }
      }}
    />
  );
};

export default NotificationDetail;
