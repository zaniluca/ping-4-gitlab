import React from "react";
import { AtSign, Circle } from "react-native-feather";
import { SvgProps } from "react-native-svg";
import { useTheme } from "../../utils/theme";
import { Headers } from "../../utils/types";

type Props = SvgProps & {
  headers: Headers;
};

const InboxItemIcon: React.FC<Props> = ({ headers, ...props }) => {
  const { colors } = useTheme();

  if (headers["x-gitlab-issue-iid"]) {
    return <Circle {...props} stroke={colors.green} />;
  }

  return <AtSign {...props} stroke={colors.purple} />;
};

export default InboxItemIcon;
