import { Formik } from "formik";
import React from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Disclaimer from "../components/Disclaimer";
import ErrorsList from "../components/ErrorsList";
import Input from "../components/Input";
import KeyboardAvoid from "../components/KeyboardAvoid";
import { Box, Text } from "../components/restyle";
import { useSignup } from "../hooks/auth-hooks";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";
import { SignupSchema } from "../utils/validation";

type Props = RootStackScreenProps<"Signup">;

const INITIAL_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
};

const PASSWORD_RULES_IOS =
  "minlength: 6; required: lower; required: upper; required: digit; required: [oqtu-#&'()+,./;?@];";

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  const signup = useSignup();

  const onSubmit = (values: typeof INITIAL_VALUES) => {
    signup.reset();
    signup.mutate(values);
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
            Sign Up
          </Text>
          <Text variant="body" marginTop="s">
            Create an account so you can save your notifications across devices
          </Text>
          <Box style={{ marginTop: 24 }}>
            <Formik
              initialValues={INITIAL_VALUES}
              onSubmit={onSubmit}
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
                    autoCompleteType="password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    passwordRules={PASSWORD_RULES_IOS}
                    textContentType="newPassword"
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
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    textContentType="newPassword"
                    passwordRules={PASSWORD_RULES_IOS}
                    onSubmitEditing={() => submit()}
                  />
                  {/* Validation errors */}
                  <Box marginTop="s">
                    {Object.entries(errors).length ? (
                      <ErrorsList errors={errors} />
                    ) : (
                      <Text variant="caption" color="secondary">
                        Your password must be 6 or more characters long &
                        contain a mix of upper & lower case letters, numbers &
                        symbols.
                      </Text>
                    )}
                  </Box>
                  {/* API Error */}
                  {signup.error && (
                    <Box marginTop="s">
                      <ErrorsList
                        errors={{
                          error:
                            signup.error.response?.data.message ??
                            "Unknown Error",
                        }}
                      />
                    </Box>
                  )}
                  {/* Signup CTA */}
                  <Box marginTop="xl">
                    <Button onPress={submit}>
                      {signup.isLoading ? (
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
                <Text variant="headline" color="accent" marginLeft="xs">
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
