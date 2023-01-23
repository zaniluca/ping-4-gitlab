import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { Dimensions } from "react-native";
import { RefreshCw } from "react-native-feather";
import * as Progress from "react-native-progress";

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
  const { colors } = useTheme();
  const notifications = useNotificationsList();
  const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);

  const data = useMemo(
    () => notifications.data?.pages?.flatMap((page) => page.data),
    [notifications.data?.pages]
  );

  const handlePullToRefresh = async () => {
    setIsManuallyRefreshing(true);
    await notifications.refetch();
    setIsManuallyRefreshing(false);
  };

  return (
    <>
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
        onRefresh={handlePullToRefresh}
        refreshing={isManuallyRefreshing}
        ListHeaderComponent={
          <Progress.Bar
            indeterminate={notifications.isRefetching}
            width={Dimensions.get("window").width}
            borderWidth={0}
            borderRadius={0}
            height={2}
            color={colors.progressBar}
          />
        }
      />
    </>
  );
};

export default InboxList;
