import React from "react";
import { TouchableOpacity } from "react-native";

import InboxItemIcon from "./InboxItemIcon";
import { useRootStackNavigation } from "../../hooks/navigation-hooks";
import timeElapsed from "../../utils/time-elapsed";
import { APINotification } from "../../utils/types";
import { Box, Text } from "../restyle";

type Props = {
  notification: APINotification;
};

const InboxItem: React.FC<Props> = ({ notification }) => {
  const navigation = useRootStackNavigation();

  const headers = notification.headers;

  const projectPath =
    headers?.["x-gitlab-project-path"] ??
    headers?.["x-gitlab-project"] ??
    headers?.["x-gitlab-group-path"];

  const getIdentifier = () => {
    if (headers?.["x-gitlab-mergerequest-iid"]) {
      return `!${headers["x-gitlab-mergerequest-iid"]}`;
    } else if (headers?.["x-gitlab-issue-iid"]) {
      return `#${headers["x-gitlab-issue-iid"]}`;
    } else if (headers?.["x-gitlab-epic-iid"]) {
      return `&${headers["x-gitlab-epic-iid"]}`;
    } else {
      return "";
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NotificationDetail", notification)}
    >
      <Box flexDirection="row" paddingHorizontal="l" paddingVertical="s">
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
            <Box flexShrink={1} paddingEnd="2xs">
              {/* Only display if it has everything */}
              {projectPath && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  variant="body"
                  color="secondary"
                >
                  {projectPath} {getIdentifier()}
                </Text>
              )}
              <Text numberOfLines={2} ellipsizeMode="tail" variant="body">
                {notification.subject}
              </Text>
            </Box>
            <Text variant="callout" color="secondary">
              {timeElapsed(new Date(notification.recived))}
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
