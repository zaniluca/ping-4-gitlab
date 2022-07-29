import React, { useLayoutEffect, useEffect } from "react";
import { ScrollView } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";

import IconButton from "../components/IconButton";
import InboxList from "../components/inbox/InboxList";
import InboxSkeleton from "../components/inbox/InboxSkeleton";
import { useNotificationsList } from "../hooks/notifications-hooks";
import { useUser } from "../hooks/user-hooks";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Inbox">;

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const notifications = useNotificationsList();
  const user = useUser();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={() => navigation.navigate("Settings")}>
          <Settings stroke={theme.colors.secondary} />
        </IconButton>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!user.hasCompletedOnboarding) {
      navigation.navigate("GetStarted");
    }
  }, [user.hasCompletedOnboarding]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.primaryBackground }}
      edges={["right", "left"]}
    >
      {notifications.isFetched ? (
        <InboxList />
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <InboxSkeleton />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default InboxScreen;
