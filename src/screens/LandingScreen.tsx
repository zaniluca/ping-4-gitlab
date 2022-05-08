import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Disclaimer from "../components/Disclaimer";
import { Box, Text } from "../components/restyle";
import { useAuth } from "../contexts/AuthContext";
import { RootStackScreenProps } from "../navigation/types";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Landing">;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  const { signInAnonymously } = useAuth();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryBackground,
        justifyContent: "flex-end",
      }}
    >
      <Box paddingHorizontal="m" marginBottom="xxl">
        <Button title="Let's get started!" onPress={signInAnonymously} />
        <Disclaimer />
        <Box
          justifyContent="center"
          flexDirection="row"
          marginTop="m"
          paddingBottom="xl"
        >
          <Text variant="body">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text variant="headline" color="indigo" marginLeft="xs">
              Login
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default LandingScreen;
