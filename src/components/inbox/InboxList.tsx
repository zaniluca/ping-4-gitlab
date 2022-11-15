import { useCallback, useMemo } from "react";
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
      margin="xl"
    >
      <RefreshCw width={12} stroke={colors.secondary} />
      <Text marginLeft="s" variant="caption" color="secondary">
        Fetching new notifications...
      </Text>
    </Box>
  );
};

const InboxList = () => {
  const notifications = useNotificationsList();

  const renderItem = useCallback(renderListRow, [notifications.data?.pages]);

  const data = useMemo(
    () => notifications.data?.pages?.flatMap((page) => page.data),
    [notifications.data?.pages]
  );

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      keyExtractor={(item) => item.id}
      removeClippedSubviews
      ListFooterComponent={
        notifications.hasNextPage ? ListFooterComponent : null
      }
      ListEmptyComponent={InboxEmpty}
      onEndReachedThreshold={0.5}
      onEndReached={() =>
        notifications.hasNextPage ? notifications.fetchNextPage() : null
      }
    />
  );
};

export default InboxList;
