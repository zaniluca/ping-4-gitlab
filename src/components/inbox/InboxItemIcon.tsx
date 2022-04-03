import React from "react";
import { AtSign, Circle } from "react-native-feather";
import { SvgProps } from "react-native-svg";
import theme from "../../utils/theme";
import { Headers } from "../../utils/types";

type Props = SvgProps & {
  headers: Headers;
};

const InboxItemIcon: React.FC<Props> = ({ headers, ...props }) => {
  if (headers["x-gitlab-issue-iid"]) {
    return <Circle {...props} stroke={"green"} />;
  }

  return <AtSign {...props} stroke={theme.colors.purpleLight} />;
};

export default InboxItemIcon;
