import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { Box, Text } from "../components/restyle";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Box paddingHorizontal="m">
        <Button
          title="Let's get started!"
          onPress={() => navigation.navigate("Inbox")}
        />
        <Text
          marginTop="m"
          paddingBottom="xl"
          variant="body"
          textAlign="center"
        >
          Already have an account?{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text variant="headline" color="purpleDark">
              Sign in
            </Text>
          </TouchableOpacity>
        </Text>
      </Box>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});