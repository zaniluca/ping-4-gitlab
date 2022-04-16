import React from "react";
import { AtSign, Circle, GitBranch } from "react-native-feather";
import { SvgProps } from "react-native-svg";
import { useTheme } from "../../utils/theme";
import { Headers } from "../../utils/types/types";

type Props = SvgProps & {
  headers: Headers;
};

const InboxItemIcon: React.FC<Props> = ({ headers, ...props }) => {
  const { colors } = useTheme();

  if (headers["x-gitlab-issue-iid"]) {
    // If it has issue iid it means is from an issue
    return <Circle {...props} stroke={colors.green} />;
  } else if (headers["x-gitlab-mergerequest-iid"]) {
    // If it has merge iid is from merge request
    return <GitBranch {...props} stroke={colors.blue} />;
  }
  // otherwise display generic icon
  return <AtSign {...props} stroke={colors.purple} />;
};

export default InboxItemIcon;
