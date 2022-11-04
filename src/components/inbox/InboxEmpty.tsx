import React from "react";
import { TouchableOpacity } from "react-native";

import { useRootStackNavigation } from "../../hooks/navigation-hooks";
import { useUser } from "../../hooks/user-hooks";
import RandomIcon from "../RandomIcon";
import Skeleton from "../Skeleton";
import { Box, Text } from "../restyle";

const InboxEmpty = () => {
  const user = useUser();
  const navigation = useRootStackNavigation();

  return (
    <Box marginTop="4xl" flexDirection="column" alignItems="center">
      <Box flexDirection="row" padding="l" justifyContent="center">
        <RandomIcon />
        <Box marginLeft="l" width="85%">
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
          padding="l"
          justifyContent="center"
          style={{ transform: [{ scale: 0.92 }] }}
        >
          <RandomIcon />
          <Box marginLeft="l" width="85%">
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
      <Box alignItems="center" marginTop="l">
        <Text variant="smallTitle">Your inbox is empty</Text>
        <Text variant="body" color="secondary" textAlign="center">
          Once you receive a notification{"\n"}you'll see that here
        </Text>
      </Box>
      {!user.hasCompletedOnboarding && (
        <Box marginTop="xl">
          <TouchableOpacity onPress={() => navigation.push("GetStarted")}>
            <Text variant="headline" color="accent" textAlign="center">
              Go back to setup screen
            </Text>
          </TouchableOpacity>
        </Box>
      )}
    </Box>
  );
};

export default InboxEmpty;
