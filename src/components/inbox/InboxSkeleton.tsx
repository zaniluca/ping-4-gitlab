import React from "react";
import Skeleton from "../Skeleton";
import { useTheme } from "../../utils/theme";
import { Box } from "../restyle";
import { AtSign, Circle, GitPullRequest } from "react-native-feather";

const InboxSkeleton = () => {
  const theme = useTheme();

  const RandomIcon = () => {
    const icons = [
      <GitPullRequest height={25} width={25} stroke={theme.colors.gray300} />,
      <AtSign height={25} width={25} stroke={theme.colors.gray300} />,
      <Circle height={25} width={25} stroke={theme.colors.gray300} />,
    ];
    return icons[Math.floor(Math.random() * 3)];
  };

  return (
    <Skeleton backgroundColor="white">
      {[...Array(8)].map((_, i) => (
        <Box key={i} flexDirection="row" padding="m">
          <RandomIcon />
          <Box marginLeft="m" width="100%">
            <Box backgroundColor="gray300" width="45%" height={11} />
            <Box
              backgroundColor="gray300"
              marginTop="s"
              width="88%"
              height={15}
            />
            <Box
              backgroundColor="gray300"
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
