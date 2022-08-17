import React from "react";

import RandomIcon from "../RandomIcon";
import Skeleton from "../Skeleton";
import { Box } from "../restyle";

const InboxSkeleton = () => {
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
