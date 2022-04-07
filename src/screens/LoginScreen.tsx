import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../utils/theme";
import KeyboardAvoid from "../components/KeyboardAvoid";
import BackButton from "../components/BackButton";
import Input from "../components/Input";
import Button from "../components/Button";
import { Formik } from "formik";
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

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
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>
            Use your credentials to log in to your account
          </Text>
          <View style={{ marginTop: 24 }}>
            <Formik
              initialValues={INITIAL_VALUES}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleChange, handleBlur, handleSubmit: submit, values }) => (
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
                  <Button
                    title="Login"
                    style={{ marginTop: 32 }}
                    onPress={submit}
                  />
                </>
              )}
            </Formik>
            <Text style={styles.body}>
              Don't have an account?{" "}
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signUpButton}> Signup</Text>
              </TouchableOpacity>
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={styles.forgotPasswordText}>
                I Forgot my Password :(
              </Text>
            </TouchableOpacity>
          </View>
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
  forgotPasswordText: {
    fontFamily: theme.fonts.sourceSansPro.semibold,
    fontSize: 17,
    color: theme.colors.purpleDark,
  },
  body: {
    marginTop: 16,
    textAlign: "center",
    fontFamily: theme.fonts.sourceSansPro.regular,
    fontSize: 17,
    color: theme.colors.gray900,
    paddingBottom: 32,
  },
  signUpButton: {
    fontFamily: theme.fonts.sourceSansPro.semibold,
    color: theme.colors.purpleDark,
    fontSize: 17,
  },
});
