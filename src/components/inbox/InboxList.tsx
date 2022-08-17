import { useCallback } from "react";
import { FlatList, ListRenderItem } from "react-native";
import { RefreshCw } from "react-native-feather";

import { useData } from "../../contexts/DataContext";
import { useTheme } from "../../utils/theme";
import { Notification } from "../../utils/types";
import { Divider } from "../ListSeparator";
import { Box, Text } from "../restyle";
import InboxEmpty from "./InboxEmpty";
import InboxItem from "./InboxItem";

const renderListRow: ListRenderItem<Notification> = ({ item }) => (
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
  const { notifications } = useData();

  const renderItem = useCallback(renderListRow, [notifications]);

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={[]}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      keyExtractor={(item) => item.id}
      removeClippedSubviews
      // ListFooterComponent={
      //   notifications.length >= 50 ? ListFooterComponent : null
      // }
      ListEmptyComponent={InboxEmpty}
    />
  );
};

export default InboxList;
