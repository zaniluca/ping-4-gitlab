import React, { useEffect } from "react";
import { WebView } from "react-native-webview";

import { useUpdateNotification } from "../hooks/notifications-hooks";
import { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"NotificationDetail">;

const NotificationDetail: React.FC<Props> = ({ route }) => {
  const updateNotification = useUpdateNotification();

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
      source={{
        html: notification.html ?? "",
      }}
      textZoom={125}
    />
  );
};

export default NotificationDetail;
