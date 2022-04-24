import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardAvoid from "../components/KeyboardAvoid";
import BackButton from "../components/BackButton";
import Input from "../components/Input";
import Button from "../components/Button";
import { Formik } from "formik";
import { SignupSchema } from "../utils/validation";
import Hint from "../components/Hint";
import { RootStackScreenProps } from "../navigation/types";
import { Box, Text } from "../components/restyle";
import Disclaimer from "../components/Disclaimer";
import { useAuth } from "../contexts/AuthContext";
import { AUTH_ERROR_MESSAGES } from "../utils/constants";

type Props = RootStackScreenProps<"Signup">;

const INITIAL_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { signup, user } = useAuth();

  const [firebaseError, setFirebaseError] = useState<string | undefined>();

  const handleSubmit = async (values: typeof INITIAL_VALUES) => {
    setFirebaseError(undefined);
    const wasAnonymous = !!user;

    try {
      await signup(values.email, values.password);
      // If the user wasn't anonymous before this process the navigation is automatic
      if (wasAnonymous) navigation.navigate("Inbox");
    } catch (error) {
      console.error("Error while signing up: ", error);

      setFirebaseError(
        AUTH_ERROR_MESSAGES[error.code] ?? "Unknown error occurred"
      );
    }
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
              validationSchema={SignupSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit: submit,
                values,
                errors,
                isSubmitting,
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
                  {/* Validation errors */}
                  <Box marginTop="s">
                    {!!Object.entries(errors).length ? (
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
                  {/* Firebase Error */}
                  {firebaseError && (
                    <Box marginTop="s">
                      <Box>
                        <Text color="red">Some errors occurred:</Text>
                        <Box flexDirection="row">
                          <Text color="red">{"\u2022"}</Text>
                          <Text color="red" paddingLeft="xs">
                            {firebaseError}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {/* Signup CTA */}
                  <Box marginTop="xl">
                    <Button onPress={submit}>
                      {isSubmitting ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        "Create an account"
                      )}
                    </Button>
                  </Box>
                </>
              )}
            </Formik>
            <Disclaimer />
            {/* Login redirect button */}
            <Box
              justifyContent="center"
              flexDirection="row"
              marginTop="m"
              paddingBottom="xl"
            >
              <Text variant="body">Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text variant="headline" color="purpleDark" marginLeft="xs">
                  Login
                </Text>
              </TouchableOpacity>
            </Box>
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
});
