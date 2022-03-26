import { FlatList, ListRenderItem } from "react-native";
import React from "react";
import InboxItem from "./InboxItem";
import { ListSeparator } from "../ListSeparator";

const DATA = [
  {
    title: "Re: general | Beverage packages ready-to-buy (SF) (#679)",
    body: "Tommaso Gangemi commented: @marco_ottone se per caso su SF (non dovrebbe accadere ma per sicurezza..) ho un preset con un drink che non c'è più nel catalogo, come dovremmo gestire la cosa? eliminiamo quel preset dal package o la gestiamo in qualche altro modo? @krzysztof.witkowski1 FYI",
  },
  {
    title: "Dan",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Dominic",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Jackson",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "James",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Joel",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "John",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Jillian",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Jimmy",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Julie",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

type InboxItem = {
  title: string;
  body: string;
};

const renderItem: ListRenderItem<InboxItem> = ({ item }) => (
  <InboxItem item={item} />
);

export default function InboxList() {
  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={DATA}
      renderItem={renderItem}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={(item) => item.title}
      removeClippedSubviews
    />
  );
}
