import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import Hint from "../components/Hint";
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

const INITIAL_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupScreen({ navigation }: Props) {
  const handleSubmit = (values: typeof INITIAL_VALUES) => {
    console.log(values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              validateOnChange={false}
              validateOnBlur={false}
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
                    error={errors.email}
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
                    error={errors.password}
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
                    error={errors.confirmPassword}
                    label="confirm"
                    autoCompleteType="password"
                  />
                  <View style={{ marginTop: 8 }}>
                    {Object.entries(errors).length > 0 ? (
                      <View>
                        <Text style={{ color: "red" }}>
                          Some errors occurred:
                        </Text>
                        {Object.entries(errors).map(([key, value]) => (
                          <View key={key} style={{ flexDirection: "row" }}>
                            <Text style={{ color: "red" }}>{"\u2022"}</Text>
                            <Text style={{ paddingLeft: 5, color: "red" }}>
                              {value}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Hint>
                        Your password must be 8 or more characters long &
                        contain a mix of upper & lower case letters, numbers &
                        symbols.
                      </Hint>
                    )}
                  </View>
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
            <Text style={styles.body}>
              Already have an account?{" "}
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signInButton}> Sign in</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </KeyboardAvoid>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
    paddingTop: 32,
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
  disclaimerText: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
  },
  disclaimerLink: {
    color: theme.colors.purpleDark,
  },
  // What a bad naming, this is actually the already have an account
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
