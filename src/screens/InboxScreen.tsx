import React, { useLayoutEffect, useEffect } from "react";
import { ScrollView } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";

import IconButton from "../components/IconButton";
import InboxList from "../components/inbox/InboxList";
import InboxSkeleton from "../components/inbox/InboxSkeleton";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useSecureStore } from "../hooks/use-secure-store";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Inbox">;

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { userData, hasLoadedFirstSnapshot } = useData();
  const { user } = useAuth();
  const { getValueForKey } = useSecureStore();

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
    if (!userData) return;
    if (userData.onboarding) {
      navigation.navigate("GetStarted");
    }
  }, [userData]);

  // TODO: remove
  useEffect(() => {
    if (!user?.isAnonymous) return;

    getValueForKey("hasMigrated").then((value) => {
      if (!value) {
        navigation.navigate("MajorChanges");
      }
    });
  }, [user]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.primaryBackground }}
      edges={["right", "left"]}
    >
      {hasLoadedFirstSnapshot ? (
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
