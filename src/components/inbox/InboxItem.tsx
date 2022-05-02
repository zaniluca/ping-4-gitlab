import { TouchableOpacity } from "react-native";
import React from "react";
import { Notification } from "../../utils/types";
import InboxItemIcon from "./InboxItemIcon";
import { Box, Text } from "../restyle";
import { useRootStackNavigation } from "../../navigation/RootStackNavigator";
import timeElapsed from "../../utils/time-elapsed";
import { sanitizeSubject } from "../../utils/sanitize";

type Props = {
  notification: Notification;
};

const InboxItem: React.FC<Props> = ({ notification }) => {
  const navigation = useRootStackNavigation();

  const headers = notification.headers;
  const iid =
    headers["x-gitlab-issue-iid"] ?? headers["x-gitlab-mergerequest-iid"];

  const projectPath =
    headers["x-gitlab-project-path"] ?? headers["x-gitlab-project"];

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NotificationDetail", notification)}
    >
      <Box flexDirection="row" paddingHorizontal="m" paddingVertical="s">
        <Box paddingRight="s" alignItems="center">
          <InboxItemIcon headers={headers} width={20} />
          {!notification.viewed && (
            <Box
              marginTop="xs"
              width={9}
              height={9}
              borderRadius={100}
              backgroundColor="blue"
            />
          )}
        </Box>
        <Box flex={1} flexShrink={1}>
          <Box flexDirection="row" justifyContent="space-between">
            <Box flexShrink={1} paddingEnd="xxs">
              {/* Only display if it has everything */}
              {projectPath && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  variant="body"
                  color="secondary"
                >
                  {projectPath} {iid ? `#${iid}` : ""}
                </Text>
              )}
              <Text numberOfLines={2} ellipsizeMode="tail" variant="body">
                {sanitizeSubject(notification)}
              </Text>
            </Box>
            <Text variant="callout" color="secondary">
              {timeElapsed(notification.recived.toDate())}
            </Text>
          </Box>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            variant="callout"
            color="secondary"
          >
            {notification.text}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default InboxItem;
