import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef } from "react";
import { WebView } from "react-native-webview";

import { useUpdateNotification } from "../hooks/notifications-hooks";
import { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"NotificationDetail">;

const NotificationDetail: React.FC<Props> = ({ route }) => {
  const updateNotification = useUpdateNotification();
  const webview = useRef<WebView | null>(null);

  const notification = route.params;

  useEffect(() => {
    if (notification.viewed) return;

    updateNotification.mutate({
      id: notification.id,
      data: { viewed: true },
    });
  }, []);

  return (
    <WebView
      originWhitelist={["*"]}
      startInLoadingState
      ref={webview}
      source={{
        html: notification.html ?? "",
      }}
      textZoom={125}
      onNavigationStateChange={async (e) => {
        if (e.url && e.url.startsWith("http")) {
          webview.current?.goBack();
          await WebBrowser.openBrowserAsync(e.url);
        }
      }}
    />
  );
};

export default NotificationDetail;
