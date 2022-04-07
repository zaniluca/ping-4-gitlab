import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { RootStackParamList } from "../navigation/types";
import theme from "../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <Button
          title="Let's get started!"
          onPress={() => navigation.navigate("Inbox")}
        />
        <Text style={styles.body}>
          Already have an account?{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInButton}> Sign in</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  body: {
    marginTop: 16,
    textAlign: "center",
    fontFamily: theme.fonts.sourceSansPro.regular,
    fontSize: 17,
    color: theme.colors.gray900,
    paddingBottom: 32,
  },
  signInButton: {
    fontFamily: theme.fonts.sourceSansPro.semibold,
    color: theme.colors.purpleDark,
    fontSize: 17,
  },
});
