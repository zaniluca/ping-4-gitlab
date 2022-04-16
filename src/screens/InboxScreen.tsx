import { collection, onSnapshot, query } from "@firebase/firestore";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import React, { useLayoutEffect } from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Settings } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../components/IconButton";
import InboxList from "../components/inbox/InboxList";
import { RootStackScreenProps } from "../navigation/types";
import { auth, firestore } from "../utils/firebase";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Inbox">;

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={() => navigation.navigate("Settings")}>
          <Settings stroke={theme.colors.gray600} />
        </IconButton>
      ),
    });
    // navigation.navigate("GetStarted");
  }, [navigation]);

  useEffect(() => {
    signInAnonymously(auth)
      .then(async (user) => {
        console.log("Logged in with uid: ", user.user.uid);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const q = query(collection(firestore, "users/test/notifications"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth status changed: ", user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <InboxList />
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
