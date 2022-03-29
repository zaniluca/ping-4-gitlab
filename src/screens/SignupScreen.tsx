import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../utils/theme";
import KeyboardAvoid from "../components/KeyboardAvoid";
import BackButton from "../components/BackButton";
import Input from "../components/Input";
import Button from "../components/Button";
import { openUrl } from "../utils/open-url";
import { Formik } from "formik";
import { signupSchema } from "../utils/validation";

const INITIAL_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupScreen() {
  const handleSubmit = (values: typeof INITIAL_VALUES) => {
    console.log(values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <KeyboardAvoid>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
          Create an account so you can save your notifications across devices
        </Text>
        <View style={{ marginTop: 24 }}>
          <Formik
            initialValues={INITIAL_VALUES}
            onSubmit={handleSubmit}
            validationSchema={signupSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit: submit,
              values,
              errors,
            }) => (
              <>
                <Input
                  placeholder="Enter your email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  label="email"
                  autoCompleteType="email"
                  spellCheck={false}
                />
                <Input
                  style={{ marginTop: 8 }}
                  secureTextEntry
                  placeholder="Enter your password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  label="password"
                  autoCompleteType="password"
                />
                <Input
                  style={{ marginTop: 8 }}
                  secureTextEntry
                  placeholder="Confirm password"
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  label="confirm"
                  autoCompleteType="password"
                />
                <Text style={styles.passwordHint}>
                  Your password must be 8 or more characters long & contain a
                  mix of upper & lower case letters, numbers & symbols.
                </Text>
                <Text>{JSON.stringify(errors, null, 2)}</Text>
                <Button
                  title="Create an account"
                  style={{ marginTop: 32 }}
                  onPress={submit}
                />
              </>
            )}
          </Formik>
          {/* Disclaimer Section */}
          <Text style={styles.disclaimerText}>
            By signing up, you're agree to our{"\n"}
            <Text
              style={styles.disclaimerLink}
              onPress={() => openUrl("https://google.com")}
            >
              Terms of Use
            </Text>{" "}
            and
            <Text
              style={styles.disclaimerLink}
              onPress={() => openUrl("https://google.com")}
            >
              {" "}
              Privacy Policy
            </Text>
            .
          </Text>
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
    marginTop: 32,
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
  passwordHint: {
    marginTop: 8,
    fontFamily: theme.fonts.sourceSansPro.regular,
    fontSize: 12,
    color: theme.colors.gray600,
  },
  disclaimerText: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
  },
  disclaimerLink: {
    color: theme.colors.purpleDark,
  },
});
