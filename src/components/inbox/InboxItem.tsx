import { TouchableOpacity } from "react-native";
import React from "react";
import { Notification } from "../../utils/types";
import InboxItemIcon from "./InboxItemIcon";
import { Box, Text } from "../restyle";
import { useRootStackNavigation } from "../../navigation/RootStackNavigator";

type Props = {
  item: Notification;
};

const InboxItem: React.FC<Props> = ({ item }) => {
  const navigation = useRootStackNavigation();

  const headers = item.headers;
  const iid =
    headers["x-gitlab-issue-iid"] ?? headers["x-gitlab-mergerequest-iid"];
  const projectPath = headers["x-gitlab-project-path"];

  const sanitizeSubject = (subject: string) => {
    return subject
      .replace(`Re: ${item.headers["x-gitlab-project"]} | `, "")
      .trimStart();
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NotificationDetail", item)}
    >
      <Box flexDirection="row" paddingHorizontal="m" paddingVertical="s">
        <Box paddingRight="s">
          <InboxItemIcon headers={headers} width={20} />
        </Box>
        <Box flexShrink={1}>
          <Box flexDirection="row" justifyContent="space-between">
            <Box flexShrink={1} justifyContent="space-between" paddingEnd="xxs">
              {/* Only display if it has everything */}
              {iid && projectPath && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  variant="body"
                  color="gray600"
                >
                  {`${projectPath} #${iid}`}
                </Text>
              )}
              <Text numberOfLines={2} ellipsizeMode="tail" variant="body">
                {sanitizeSubject(item.subject)}
              </Text>
            </Box>
            <Text variant="callout" color="gray600">
              1h
            </Text>
          </Box>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            variant="callout"
            color="gray600"
          >
            {item.text}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default InboxItem;
