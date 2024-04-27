import { useFormik, FormikProvider } from "formik";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Disclaimer from "../components/Disclaimer";
import ErrorsList from "../components/ErrorsList";
import Input from "../components/Input";
import KeyboardAvoid from "../components/KeyboardAvoid";
import { Box, Text } from "../components/restyle";
import { useGitlabLogin, useSignup } from "../hooks/auth-hooks";
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
  const loginWithGitlab = useGitlabLogin();

  const signup = useSignup();

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: SignupSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      signup.reset();
      signup.mutate(values);
    },
  });

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
          <Text variant="largeTitle" marginTop="xl">
            Sign Up
          </Text>
          <Text variant="body" marginTop="s">
            Create an account so you can save your notifications across devices
          </Text>
          <Box style={{ marginTop: 24 }}>
            <FormikProvider value={formik}>
              <>
                <Input
                  placeholder="Enter your email"
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  value={formik.values.email}
                  error={formik.errors.email}
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
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  value={formik.values.password}
                  error={formik.errors.password}
                  label="password"
                  autoComplete="password"
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
                  onChangeText={formik.handleChange("confirmPassword")}
                  onBlur={formik.handleBlur("confirmPassword")}
                  value={formik.values.confirmPassword}
                  error={formik.errors.confirmPassword}
                  label="confirm"
                  autoComplete="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  textContentType="newPassword"
                  passwordRules={PASSWORD_RULES_IOS}
                  onSubmitEditing={() => formik.handleSubmit()}
                />
                {/* Validation errors */}
                <Box marginTop="s">
                  {Object.entries(formik.errors).length ? (
                    <ErrorsList errors={formik.errors} />
                  ) : (
                    <Text variant="caption" color="secondary">
                      Your password must be 6 or more characters long & contain
                      a mix of upper & lower case letters, numbers & symbols.
                    </Text>
                  )}
                </Box>
                {/* API Error */}
                {signup.error && (
                  <Box marginTop="s">
                    <ErrorsList
                      errors={{
                        error:
                          signup.error.response?.data?.message ??
                          "Unknown Error",
                      }}
                    />
                  </Box>
                )}
                {/* Signup CTA */}
                <Box marginTop="3xl">
                  <Button onPress={formik.handleSubmit}>
                    {signup.isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      "Create an account"
                    )}
                  </Button>
                </Box>
                {/* Gitlab CTA */}
                {Platform.OS === "ios" && ( // TODO: remove this when we have a way to login with Gitlab on Android
                  <Box marginTop="m">
                    <Button onPress={loginWithGitlab} variant="outline">
                      Continue with Gitlab
                    </Button>
                  </Box>
                )}
              </>
            </FormikProvider>
            <Disclaimer />
            {/* Login redirect button */}
            <Box
              justifyContent="center"
              flexDirection="row"
              marginTop="l"
              paddingBottom="3xl"
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
