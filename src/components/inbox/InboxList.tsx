import { FlatList, ListRenderItem } from "react-native";
import InboxItem from "./InboxItem";
import { ListSeparator } from "../ListSeparator";
import { Notification } from "../../utils/types";
import { useData } from "../../contexts/DataContext";
import { useCallback } from "react";
import { Box, Text } from "../restyle";
import { RefreshCw } from "react-native-feather";
import { useTheme } from "../../utils/theme";

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
      data={notifications}
      renderItem={renderItem}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={(item) => item.id}
      removeClippedSubviews
      ListFooterComponent={ListFooterComponent}
    />
  );
};

export default InboxList;
