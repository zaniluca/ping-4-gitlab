import React from "react";
import SkeletonContent from "react-native-skeleton-content";
import { ICustomViewStyle } from "react-native-skeleton-content/lib/Constants";

const layout: ICustomViewStyle[] = [
  {
    flexDirection: "row",
    children: [
      {
        width: 44,
        height: 44,
        borderRadius: 30,
      },
      {
        flexDirection: "column",
        paddingLeft: 12,
        children: [
          {
            width: 100,
            height: 12,
            borderRadius: 0,
          },
          {
            marginTop: 10,
            width: 185,
            height: 6,
            borderRadius: 0,
          },
          {
            marginTop: 10,
            width: 112,
            height: 6,
            borderRadius: 0,
          },
        ],
      },
    ],
  },
];

const InboxPlaceholder = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <SkeletonContent
      containerStyle={{ flex: 1, width: 300 }}
      isLoading={isLoading}
      boneColor={"#CCCCCC"}
      highlightColor={"#ECECEC"}
      animationType="pulse"
      layout={layout}
    />
  );
};

export default InboxPlaceholder;
