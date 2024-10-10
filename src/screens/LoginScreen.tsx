import { FormikProvider, useFormik } from "formik";
import React from "react";
import { TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "../components/BackButton";
import Button from "../components/Button";
import ErrorsList from "../components/ErrorsList";
import Input from "../components/Input";
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

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: LoginSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      login.reset();
      login.mutate(values);
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
        <Text variant="largeTitle" marginTop="xl">
          Login
        </Text>
        <Text variant="body" marginTop="s">
          Use your credentials to log in to your account
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
                returnKeyType="done"
                textContentType="password"
                onSubmitEditing={() => formik.handleSubmit()}
              />
              {/* Validation Errors */}
              {!!Object.entries(formik.errors).length && (
                <Box marginTop="s">
                  <ErrorsList errors={formik.errors} />
                </Box>
              )}
              {/* API Error */}
              {login.error && (
                <Box marginTop="s">
                  <ErrorsList
                    errors={{
                      error:
                        login.error.response?.data?.message ?? "Unknown error",
                    }}
                  />
                </Box>
              )}
              {/* Login CTA */}
              <Box marginTop="3xl">
                <Button onPress={formik.handleSubmit}>
                  {login.isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Box>
            </>
          </FormikProvider>
          {/* Signup navigation */}
          <Box
            justifyContent="center"
            flexDirection="row"
            marginTop="l"
            paddingBottom="3xl"
          >
            <Text variant="body">Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text variant="headline" color="accent" marginLeft="xs">
                Signup
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
