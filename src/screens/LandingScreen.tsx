import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../components/Button";
import Disclaimer from "../components/Disclaimer";
import { Box, Text } from "../components/restyle";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Landing">;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  // "transparent" doesn't work properly on iOS so we have to use this workaround
  const transparent = colorScheme === "light" ? "#FFFFFF00" : "#1F1F1F00";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryBackground,
        zIndex: 1000,
      }}
    >
      <Box paddingHorizontal="m" marginBottom="xxl" flex={1}>
        <Box flexDirection="column" flexGrow={1} marginTop="xl">
          <Box alignItems="center">
            <Text variant="smallTitle" color="primary">
              Never miss a notification
            </Text>
            <Text variant="body" color="secondary">
              All your GitLab activities in one place
            </Text>
          </Box>
          <LinearGradient
            colors={[transparent, colors.primaryBackground]}
            style={{
              flex: 1,
            }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0, y: 0.92 }}
          >
            <Image
              source={require("../../assets/landing-screen-1.png")}
              style={{
                height: "100%",
                width: "90%",
                alignSelf: "center",
                resizeMode: "contain",
                zIndex: -1,
              }}
            />
          </LinearGradient>
        </Box>
        <Box flexShrink={1}>
          <Button
            title="Let's get started!"
            onPress={() => navigation.navigate("Signup")}
          />
          <Disclaimer />
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
      </Box>
    </SafeAreaView>
  );
};

export default LandingScreen;
