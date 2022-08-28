import { Formik } from "formik";
import React from "react";
import { TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "../components/BackButton";
import Button from "../components/Button";
import ErrorsList from "../components/ErrorsList";
import Input from "../components/Input";
import KeyboardAvoid from "../components/KeyboardAvoid";
import { Box, Text } from "../components/restyle";
import { useLogin } from "../hooks/auth-hooks";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";
import { LoginSchema } from "../utils/validation";

type Props = RootStackScreenProps<"Login">;

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  const login = useLogin();

  const onSubmit = (values: typeof INITIAL_VALUES) => {
    login.reset();
    login.mutate(values);
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
              onSubmit={onSubmit}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={LoginSchema}
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
                    autoComplete="email"
                    spellCheck={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="next"
                    textContentType="emailAddress"
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
                    autoComplete="password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    textContentType="password"
                    onSubmitEditing={() => submit()}
                  />
                  {/* Validation Errors */}
                  {!!Object.entries(errors).length && (
                    <Box marginTop="s">
                      <ErrorsList errors={errors} />
                    </Box>
                  )}
                  {/* API Error */}
                  {login.error && (
                    <Box marginTop="s">
                      <ErrorsList
                        errors={{
                          error:
                            login.error.response?.data.message ??
                            "Unknown error",
                        }}
                      />
                    </Box>
                  )}
                  {/* Login CTA */}
                  <Box marginTop="xl">
                    <Button onPress={submit}>
                      {login.isLoading ? (
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
                <Text variant="headline" color="accent" marginLeft="xs">
                  Signup
                </Text>
              </TouchableOpacity>
            </Box>
            {/* Forgot Password Button */}
            {/* <Box flexDirection="row" justifyContent="center" marginTop="m">
              <TouchableOpacity>
                <Text variant="headline" color="accent">
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
