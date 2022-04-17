import { FlatList, ListRenderItem } from "react-native";
import React, { useEffect } from "react";
import InboxItem from "./InboxItem";
import { ListSeparator } from "../ListSeparator";
import { Notification } from "../../utils/types";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const renderItem: ListRenderItem<Notification> = ({ item }) => (
  <InboxItem item={item} />
);

const InboxList = () => {
  const [data, setData] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore, "users/test/notifications"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // querySnapshot.docChanges().forEach((change) => {
      //   if (change.type === "added") {
      //     console.log("New Notification!: ", change.doc.data());
      //   }
      //   if (change.type === "modified") {
      //     console.log("Notification Modified: ", change.doc.data());
      //   }
      // });

      let docs: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const noti = doc.data() as Notification;
        // Setting document id as notification id
        noti.id = doc.id;
        docs.push(noti);
      });
      setData(docs);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={(item) => item.id}
      removeClippedSubviews
    />
  );
};

export default InboxList;
