import React, { useLayoutEffect } from "react";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../components/IconButton";
import InboxList from "../components/inbox/InboxList";
import { Box, Text } from "../components/restyle";
import { useData } from "../contexts/DataContext";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Inbox">;

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { userData, hasLoadedFirstSnapshot } = useData();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={() => navigation.navigate("Settings")}>
          <Settings stroke={theme.colors.gray600} />
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
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      {hasLoadedFirstSnapshot ? (
        <InboxList />
      ) : (
        <Box flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator color={theme.colors.indigo} />
          <Text marginTop="m" variant="caption">
            Loading Notifications...
          </Text>
        </Box>
      )}
    </SafeAreaView>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
