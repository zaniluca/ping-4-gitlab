import { FlashList } from "@shopify/flash-list";
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
        Only the last 50 notifications are loaded
      </Text>
    </Box>
  );
};

const InboxList = () => {
  const { data: notifications } = useNotificationsList();

  return (
    <FlashList
      contentInsetAdjustmentBehavior="automatic"
      data={notifications}
      renderItem={({ item }) => <InboxItem notification={item} />}
      ItemSeparatorComponent={Divider}
      keyExtractor={(item) => item.id}
      removeClippedSubviews
      estimatedItemSize={80}
      ListFooterComponent={
        (notifications?.length ?? 0) >= 50 ? ListFooterComponent : null
      }
      ListEmptyComponent={InboxEmpty}
    />
  );
};

export default InboxList;
