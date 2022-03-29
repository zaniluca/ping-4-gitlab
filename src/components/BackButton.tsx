import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import theme from "../utils/theme";
import { ArrowLeft } from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

const BackButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log("Can't go back");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleGoBack}>
      <ArrowLeft stroke={theme.colors.gray900} />
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  text: {
    marginLeft: 4,
    fontFamily: theme.fonts.sourceSansPro.semibold,
    fontSize: 17,
    color: theme.colors.gray900,
  },
});
