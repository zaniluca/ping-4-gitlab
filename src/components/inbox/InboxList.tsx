import { FlatList, ListRenderItem } from "react-native";
import React, { useEffect } from "react";
import InboxItem from "./InboxItem";
import { ListSeparator } from "../ListSeparator";
import { Notification } from "../../utils/types/types";
import { signInAnonymously } from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";
import { auth, firestore } from "../../utils/firebase";
import { useState } from "react";

const renderItem: ListRenderItem<Notification> = ({ item }) => (
  <InboxItem item={item} />
);

const InboxList = () => {
  const [data, setData] = useState<Notification[]>([]);

  useEffect(() => {
    signInAnonymously(auth)
      .then(async (user) => {
        console.log("Logged in with uid: ", user.user.uid);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const q = query(collection(firestore, "users/test/notifications"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let docs: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const noti = doc.data() as Notification;
        noti.id = doc.id;
        docs.push(noti);
      });
      setData(docs);
    });
    return () => unsubscribe();
  }, []);

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
