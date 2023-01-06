import { FlashList } from "@shopify/flash-list";
import { useMemo } from "react";
import { RefreshCw } from "react-native-feather";

import { useNotificationsList } from "../../hooks/notifications-hooks";
import { useTheme } from "../../utils/theme";
import { Divider } from "../ListSeparator";
import { Box, Text } from "../restyle";
import InboxEmpty from "./InboxEmpty";
import InboxItem from "./InboxItem";

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

  const data = useMemo(
    () => notifications.data?.pages?.flatMap((page) => page.data),
    [notifications.data?.pages]
  );

  return (
    <FlashList
      contentInsetAdjustmentBehavior="automatic"
      renderItem={({ item }) => <InboxItem notification={item} />}
      data={data}
      ItemSeparatorComponent={Divider}
      keyExtractor={(item) => item.id}
      removeClippedSubviews
      estimatedItemSize={80}
      ListFooterComponent={
        notifications.hasNextPage ? ListFooterComponent : null
      }
      ListEmptyComponent={InboxEmpty}
      onEndReachedThreshold={0.5}
      onEndReached={() =>
        notifications.hasNextPage ? notifications.fetchNextPage() : null
      }
      onRefresh={notifications.refetch}
      refreshing={notifications.isRefetching}
    />
  );
};

export default InboxList;
