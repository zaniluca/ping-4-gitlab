import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardAvoid from "../components/KeyboardAvoid";
import BackButton from "../components/BackButton";
import Input from "../components/Input";
import Button from "../components/Button";
import { Formik } from "formik";
import { RootStackScreenProps } from "../navigation/types";
import { Box, Text } from "../components/restyle";
import { LoginSchema } from "../utils/validation";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { AUTH_ERROR_MESSAGES } from "../utils/constants";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Login">;

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, user } = useAuth();
  const { colors } = useTheme();
  const [firebaseError, setFirebaseError] = useState<string | undefined>();

  const handleSubmit = async (values: typeof INITIAL_VALUES) => {
    setFirebaseError(undefined);
    const wasAnonymous = !!user;

    try {
      await login(values.email, values.password);
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
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: colors.primaryBackground,
        paddingTop: 32,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />
        <KeyboardAvoid>
          <Text variant="largeTitle" marginTop="l">
            Login
          </Text>
          <Text variant="body" marginTop="s">
            Use your credentials to log in to your account
          </Text>
          <Box style={{ marginTop: 24 }}>
            <Formik
              initialValues={INITIAL_VALUES}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={LoginSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit: submit,
                values,
                isSubmitting,
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
                  {/* Validation Errors */}
                  {!!Object.entries(errors).length && (
                    <Box marginTop="s">
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
                    </Box>
                  )}
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
                  {/* Login CTA */}
                  <Box marginTop="xl">
                    <Button onPress={submit}>
                      {isSubmitting ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </Box>
                </>
              )}
            </Formik>
            {/* Signup navigation */}
            <Box
              justifyContent="center"
              flexDirection="row"
              marginTop="m"
              paddingBottom="xl"
            >
              <Text variant="body">Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text variant="headline" color="indigo" marginLeft="xs">
                  Signup
                </Text>
              </TouchableOpacity>
            </Box>
            {/* Forgot Password Button */}
            {/* <Box flexDirection="row" justifyContent="center" marginTop="m">
              <TouchableOpacity>
                <Text variant="headline" color="indigo">
                  I Forgot my Password :(
                </Text>
              </TouchableOpacity>
            </Box> */}
          </Box>
        </KeyboardAvoid>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
