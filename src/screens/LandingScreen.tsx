import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Disclaimer from "../components/Disclaimer";
import { Box, Text } from "../components/restyle";
import { RootStackScreenProps } from "../navigation/types";
import { http } from "../utils/http";
import { useTheme } from "../utils/theme";

type Props = RootStackScreenProps<"Landing">;

type SignupResponse = {
  accessToken: string;
  refreshToken: string;
};

const signInAnonymously = () => http.post("anonymous").then((res) => res.data);

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation<SignupResponse>(signInAnonymously, {
    onSuccess: () => {
      queryClient.refetchQueries(["user"]);
    },
  });

  const handleAnonymousSignIn = async () => {
    const data = await mutateAsync();
    console.log("data: ", data);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryBackground,
        justifyContent: "flex-end",
      }}
    >
      <Box paddingHorizontal="m" marginBottom="xxl">
        <Button title="Let's get started!" onPress={handleAnonymousSignIn} />
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
    </SafeAreaView>
  );
};

export default LandingScreen;
