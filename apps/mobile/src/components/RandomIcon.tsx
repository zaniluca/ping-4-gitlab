import React from "react";
import { AtSign, GitPullRequest, Circle } from "react-native-feather";

import { useTheme } from "../utils/theme";

const RandomIcon = () => {
  const theme = useTheme();

  const icons = [
    <GitPullRequest height={25} width={25} stroke={theme.colors.tertiary} />,
    <AtSign height={25} width={25} stroke={theme.colors.tertiary} />,
    <Circle height={25} width={25} stroke={theme.colors.tertiary} />,
  ];

  return icons[Math.floor(Math.random() * 3)];
};

export default RandomIcon;
