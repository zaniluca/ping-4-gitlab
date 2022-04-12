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
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, Text } from "../components/restyle";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const handleSubmit = (values: typeof INITIAL_VALUES) => {
    console.log(values);
  };

  return (
    <SafeAreaView style={styles.container}>
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
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit: submit,
                values,
                isSubmitting,
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
                <Text variant="headline" color="purpleDark" marginLeft="xs">
                  Signup
                </Text>
              </TouchableOpacity>
            </Box>
            {/* Forgot Password Button */}
            <Box flexDirection="row" justifyContent="center" marginTop="m">
              <TouchableOpacity>
                <Text variant="headline" color="purpleDark">
                  I Forgot my Password :(
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </KeyboardAvoid>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
    paddingTop: 32,
  },
});
