import { FlatList, ListRenderItem } from "react-native";
import InboxItem from "./InboxItem";
import { ListSeparator } from "../ListSeparator";
import { Notification } from "../../utils/types";
import { useData } from "../../contexts/DataContext";

const renderItem: ListRenderItem<Notification> = ({ item }) => (
  <InboxItem item={item} />
);

const InboxList = () => {
  const { notifications } = useData();

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={notifications}
      renderItem={renderItem}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={(item) => item.id}
      removeClippedSubviews
    />
  );
};

export default InboxList;
