import { TouchableOpacity } from "react-native";
import React from "react";
import { Notification, PipelineStatus } from "../../utils/types";
import InboxItemIcon from "./InboxItemIcon";
import { Box, Text } from "../restyle";
import { useRootStackNavigation } from "../../navigation/RootStackNavigator";
import timeElapsed from "../../utils/time-elapsed";

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

  const sanitizeSubject = () => {
    const isPipe = !!headers["x-gitlab-pipeline-id"];

    const PIPELINE_SUBJECT: Record<PipelineStatus, string> = {
      success: "Pipeline Succeded!",
      failed: "Pipeline Failed!",
    };

    if (isPipe) {
      const status = headers["x-gitlab-pipeline-status"];
      return status ? PIPELINE_SUBJECT[status] : "Pipeline";
    }

    return notification.subject
      .replace(`Re: ${headers["x-gitlab-project"]} | `, "")
      .trimStart();
  };

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
                  color="gray600"
                >
                  {projectPath} {iid ? `#${iid}` : ""}
                </Text>
              )}
              <Text numberOfLines={2} ellipsizeMode="tail" variant="body">
                {sanitizeSubject()}
              </Text>
            </Box>
            <Text variant="callout" color="gray600">
              {timeElapsed(notification.recived.toDate())}
            </Text>
          </Box>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            variant="callout"
            color="gray600"
          >
            {notification.text}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default InboxItem;
