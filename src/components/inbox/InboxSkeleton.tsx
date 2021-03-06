import React from "react";
import { AtSign, Circle, GitPullRequest } from "react-native-feather";

import { useTheme } from "../../utils/theme";
import Skeleton from "../Skeleton";
import { Box } from "../restyle";

const InboxSkeleton = () => {
  const theme = useTheme();

  const RandomIcon = () => {
    const icons = [
      <GitPullRequest height={25} width={25} stroke={theme.colors.tertiary} />,
      <AtSign height={25} width={25} stroke={theme.colors.tertiary} />,
      <Circle height={25} width={25} stroke={theme.colors.tertiary} />,
    ];
    return icons[Math.floor(Math.random() * 3)];
  };

  return (
    <Skeleton backgroundColor="primaryBackground">
      {[...Array(8)].map((_, i) => (
        <Box key={i} flexDirection="row" padding="m">
          <RandomIcon />
          <Box marginLeft="m" width="100%">
            <Box backgroundColor="tertiary" width="45%" height={11} />
            <Box
              backgroundColor="tertiary"
              marginTop="s"
              width="88%"
              height={15}
            />
            <Box
              backgroundColor="tertiary"
              marginTop="s"
              width="75%"
              height={12}
            />
          </Box>
        </Box>
      ))}
    </Skeleton>
  );
};

export default InboxSkeleton;
