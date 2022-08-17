import React from "react";

import RandomIcon from "../RandomIcon";
import Skeleton from "../Skeleton";
import { Box, Text } from "../restyle";

const InboxEmpty = () => {
  return (
    <Box marginTop="xxl" flexDirection="column" alignItems="center">
      <Box flexDirection="row" padding="m" justifyContent="center">
        <RandomIcon />
        <Box marginLeft="m" width="85%">
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
      <Skeleton backgroundColor="primaryBackground">
        <Box
          flexDirection="row"
          padding="m"
          justifyContent="center"
          style={{ transform: [{ scale: 0.92 }] }}
        >
          <RandomIcon />
          <Box marginLeft="m" width="85%">
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
      </Skeleton>
      <Box alignItems="center" marginTop="m">
        <Text variant="smallTitle">Your inbox is empty</Text>
        <Text variant="body" color="secondary" textAlign="center">
          Once you receive a notification{"\n"}you'll see that here
        </Text>
      </Box>
    </Box>
  );
};

export default InboxEmpty;
