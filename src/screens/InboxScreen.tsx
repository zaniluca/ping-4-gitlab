import React, { useLayoutEffect } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../components/IconButton";
import InboxList from "../components/inbox/InboxList";
import { useData } from "../contexts/DataContext";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";
import InboxSkeleton from "../components/inbox/InboxSkeleton";

type Props = RootStackScreenProps<"Inbox">;

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { userData, hasLoadedFirstSnapshot } = useData();

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
