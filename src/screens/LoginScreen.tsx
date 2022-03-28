import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../utils/theme";
import KeyboardAvoid from "../components/KeyboardAvoid";
import BackButton from "../components/BackButton";
import Input from "../components/Input";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <KeyboardAvoid>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Use your credentials to log in to your account
        </Text>
        <View style={{ marginTop: 24 }}>
          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            label="email"
            autoCompleteType="email"
            spellCheck={false}
          />
          <Input
            style={{ marginTop: 8 }}
            secureTextEntry
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            label="password"
            autoCompleteType="password"
          />
        </View>
      </KeyboardAvoid>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  title: {
    marginTop: 20,
    fontFamily: theme.fonts.sourceSansPro.bold,
    fontSize: 34,
    color: theme.colors.gray900,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: theme.fonts.sourceSansPro.regular,
    fontSize: 17,
    color: theme.colors.gray900,
  },
});
