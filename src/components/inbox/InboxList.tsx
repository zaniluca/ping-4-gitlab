import { useCallback } from "react";
import { FlatList, ListRenderItem } from "react-native";
import { RefreshCw } from "react-native-feather";

import { useNotificationsList } from "../../hooks/notifications-hooks";
import { useTheme } from "../../utils/theme";
import { APINotification } from "../../utils/types";
import { Divider } from "../ListSeparator";
import { Box, Text } from "../restyle";
import InboxEmpty from "./InboxEmpty";
import InboxItem from "./InboxItem";

const renderListRow: ListRenderItem<APINotification> = ({ item }) => (
  <InboxItem notification={item} />
);

const ListFooterComponent = () => {
  const { colors } = useTheme();

  return (
    <Box
      flex={1}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      margin="l"
    >
      <RefreshCw width={12} stroke={colors.secondary} />
      <Text marginLeft="s" variant="caption" color="secondary">
        Only the last 50 notifications are loaded
      </Text>
    </Box>
  );
};

const InboxList = () => {
  const { data: notifications } = useNotificationsList();

  const renderItem = useCallback(renderListRow, [notifications]);

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={notifications}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      keyExtractor={(item) => item.id}
      removeClippedSubviews
      ListFooterComponent={
        (notifications?.length ?? 0) >= 50 ? ListFooterComponent : null
      }
      ListEmptyComponent={InboxEmpty}
    />
  );
};

export default InboxList;
