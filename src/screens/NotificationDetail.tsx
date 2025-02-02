import React, { useEffect, useLayoutEffect, useRef } from "react";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";

import {
  useNotification,
  useUpdateNotification,
} from "../hooks/notifications-hooks";
import { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"NotificationDetail">;

const NotificationDetail: React.FC<Props> = ({ route, navigation }) => {
  const updateNotification = useUpdateNotification();
  const webview = useRef<WebView | null>(null);

  const notificationId = route.params.id;

  const { data: notification } = useNotification(notificationId, {
    onError: (error) => {
      navigation.setOptions({
        title: "Whoops!",
      });
      console.error("Failed to load notification", error);
      Toast.show({
        type: "error",
        text1: "Failed to load notification",
        text2: "There was an error loading the notification's content",
      });
    },
  });

  useLayoutEffect(() => {
    if (!notification) return;

    navigation.setOptions({
      title: notification.subject,
    });
  }, [notification]);

  useEffect(() => {
    if (notification?.viewed) return;

    updateNotification.mutate({
      id: notificationId,
      data: { viewed: true },
    });
  }, [notification]);

  return (
    <WebView
      originWhitelist={["*"]}
      startInLoadingState
      ref={webview}
      source={{
        html: notification?.html ?? "",
      }}
      textZoom={125}
    />
  );
};

export default NotificationDetail;
