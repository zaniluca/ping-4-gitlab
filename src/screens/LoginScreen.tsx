import { TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
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
import { useTheme } from "../utils/theme";
import ErrorsList from "../components/ErrorsList";
import { useMutation } from "@tanstack/react-query";
import { http } from "../utils/http";
import { APIError } from "../utils/types";
import { useUser } from "../hooks/user-hooks";

type Props = RootStackScreenProps<"Login">;

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const login = (payload: typeof INITIAL_VALUES) =>
  http.post("login", payload).then((res) => res.data);

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { data: user } = useUser();
  const { colors } = useTheme();

  const { mutate, reset, error, isLoading } = useMutation(login, {
    onSuccess: () => {
      // If the user wasn't anonymous before this process the navigation is automatically
      if (user) navigation.navigate("Inbox");
    },
    onError: (err: APIError) => {
      console.log("Error during /login: ", err.response?.data.message);
    },
  });

  const onSubmit = (values: typeof INITIAL_VALUES) => {
    reset();
    mutate(values);
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
                  {error && (
                    <Box marginTop="s">
                      <ErrorsList
                        errors={{
                          error:
                            error.response?.data.message ?? "Unknown error",
                        }}
                      />
                    </Box>
                  )}
                  {/* Login CTA */}
                  <Box marginTop="xl">
                    <Button onPress={submit}>
                      {isLoading ? (
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
