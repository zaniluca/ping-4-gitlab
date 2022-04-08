import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { Box, Text } from "../components/restyle";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

const INITIAL_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const handleSubmit = (values: typeof INITIAL_VALUES) => {
    console.log(values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />
        <KeyboardAvoid>
          <Text variant="largeTitle" marginTop="l">
            Sign Up
          </Text>
          <Text variant="body" marginTop="s">
            Create an account so you can save your notifications across devices
          </Text>
          <Box style={{ marginTop: 24 }}>
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
                  <Box marginTop="s">
                    {Object.entries(errors).length > 0 ? (
                      <Box>
                        <Text color="red">Some errors occurred:</Text>
                        {Object.entries(errors).map(([key, value]) => (
                          <Box key={key} flexDirection="row">
                            <Text color="red">{"\u2022"}</Text>
                            <Text color="red" paddingLeft="xs">
                              {value}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Hint>
                        Your password must be 8 or more characters long &
                        contain a mix of upper & lower case letters, numbers &
                        symbols.
                      </Hint>
                    )}
                  </Box>
                  <Button
                    title="Create an account"
                    style={{ marginTop: 32 }}
                    onPress={submit}
                  />
                </>
              )}
            </Formik>
            {/* Disclaimer Section */}
            <Text marginTop="m" style={styles.disclaimerText}>
              By signing up, you're agree to our{"\n"}
              <Text
                color="purpleDark"
                onPress={() => openUrl("https://google.com")}
              >
                Terms of Use
              </Text>{" "}
              and
              <Text
                color="purpleDark"
                onPress={() => openUrl("https://google.com")}
              >
                {" "}
                Privacy Policy
              </Text>
              .
            </Text>
            <Text marginTop="m" paddingBottom="xl" variant="body">
              Already have an account?{" "}
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text variant="headline" color="purpleDark">
                  {" "}
                  Sign in
                </Text>
              </TouchableOpacity>
            </Text>
          </Box>
        </KeyboardAvoid>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
    paddingTop: 32,
  },
  disclaimerText: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
  },
});
