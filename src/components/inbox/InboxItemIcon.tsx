import React from "react";
import {
  AtSign,
  Circle,
  GitPullRequest,
  CheckCircle,
  XCircle,
  GitCommit,
  Layers,
} from "react-native-feather";
import { SvgProps } from "react-native-svg";

import { useTheme } from "../../utils/theme";
import { Headers } from "../../utils/types";

type Props = SvgProps & {
  headers: Partial<Headers>;
};

const InboxItemIcon: React.FC<Props> = ({ headers, ...props }) => {
  const { colors } = useTheme();

  const isIssue = headers["x-gitlab-issue-iid"];
  const isMerge = headers["x-gitlab-mergerequest-iid"];
  const isPipe = headers["x-gitlab-pipeline-id"];
  const isCommit = headers["x-gitlab-commit-id"];
  const isEpic = headers["x-gitlab-epic-iid"];

  if (isIssue) {
    return <Circle {...props} stroke={colors.green} />;
  } else if (isMerge) {
    return <GitPullRequest {...props} stroke={colors.blue} />;
  } else if (isCommit) {
    return <GitCommit {...props} stroke={colors.orange} />;
  } else if (isEpic) {
    return <Layers {...props} stroke={colors.purple} />;
  } else if (isPipe) {
    if (headers["x-gitlab-pipeline-status"] === "success") {
      return <CheckCircle {...props} stroke={colors.green} />;
    }
    return <XCircle {...props} stroke={colors.red} />;
  }
  // otherwise display generic icon
  return <AtSign {...props} stroke={colors.purple} />;
};

export default InboxItemIcon;
