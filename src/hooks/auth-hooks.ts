import { useQueryClient, useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { WebBrowserRedirectResult } from "expo-web-browser";
import Toast from "react-native-toast-message";
import * as Sentry from "sentry-expo";

import { API_URL, http } from "../utils/http";
import { APIAuthResponse, APIError } from "../utils/types";
import { useRootStackNavigation } from "./navigation-hooks";
import { useSecureStore } from "./use-secure-store";
import { useUser } from "./user-hooks";

type AuthPayload = {
  email: string;
  password: string;
};

const login = (payload: AuthPayload) =>
  http.post("login", payload).then((res) => res.data as APIAuthResponse);

const signup = (payload: AuthPayload) =>
  http.post("signup", payload).then((res) => res.data as APIAuthResponse);

const anonymousLogin = () =>
  http.post("anonymous").then((res) => res.data as APIAuthResponse);

export const useSignup = () => {
  const user = useUser();
  const navigation = useRootStackNavigation();
  const { setValueForKey } = useSecureStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      await setValueForKey("accessToken", data.accessToken);
      await setValueForKey("refreshToken", data.refreshToken);
      // If there was already a user, it means it was an anonymous one
      if (user.data) navigation.navigate("Inbox");
      await queryClient.refetchQueries(["user"]);
    },
    onError: (err: APIError) => {
      console.error("Error during POST /signup: ", err.message);
    },
  });
};

export const useLogin = () => {
  const user = useUser();
  const navigation = useRootStackNavigation();
  const { setValueForKey } = useSecureStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await setValueForKey("accessToken", data.accessToken);
      await setValueForKey("refreshToken", data.refreshToken);
      // If there was already a user, it means it was an anonymous one
      if (user.data) navigation.navigate("Inbox");
      await queryClient.refetchQueries(["user"]);
    },
    onError: (err: APIError) => {
      console.error("Error during POST /login: ", err.response?.data.message);
    },
  });
};

export const useAnonymousLogin = () => {
  const { setValueForKey } = useSecureStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: anonymousLogin,
    onSuccess: async (data) => {
      await setValueForKey("accessToken", data.accessToken);
      await setValueForKey("refreshToken", data.refreshToken);
      await queryClient.refetchQueries(["user"]);
    },
    onError: (err: APIError) => {
      console.error(
        "Error signing in POST /anonymous",
        err.response?.data.message
      );
    },
  });
};

export const useLogout = () => {
  const { deleteValueForKey } = useSecureStore();
  const queryClient = useQueryClient();

  return async () => {
    try {
      await deleteValueForKey("accessToken");
      await deleteValueForKey("refreshToken");

      await queryClient.resetQueries(["user"]);
      await queryClient.resetQueries(["notifications"]);

      console.log("User logged out");
    } catch (err: any) {
      console.error("Error during logout: ", err.message);
    }
  };
};

export const useGitlabLogin = () => {
  const user = useUser();
  const { setValueForKey } = useSecureStore();
  const queryClient = useQueryClient();

  return async () => {
    try {
      const res = (await WebBrowser.openAuthSessionAsync(
        `${API_URL}/oauth/gitlab/authorize?state=${user.data?.id ?? ""}`,
        Linking.createURL("/login/gitlab")
      )) as WebBrowserRedirectResult;

      // Only "success" is a suppoterd type but this doesn't ensure that the
      // response is a successful one
      if (res.type !== "success" && res.type === "cancel") {
        console.warn("OAuth cancelled by user");
        return;
      }

      if (res.type !== "success") {
        console.error("Error response from OAuth: ", res);
        Sentry.Native.captureException(
          new Error("Error response from OAuth: " + JSON.stringify(res))
        );
        return;
      }

      const parsedResponse = Linking.parse(res.url);

      const error = parsedResponse.queryParams?.error;

      if (error) {
        console.error("Error during Gitlab login: ", error);

        Toast.show({
          type: "error",
          text1: "Error during Gitlab login",
          text2: error as string,
        });

        return;
      }

      const accessToken = parsedResponse.queryParams?.accessToken;
      const refreshToken = parsedResponse.queryParams?.refreshToken;

      if (!accessToken || !refreshToken) {
        console.error(
          "Token not provided in Gitlab OAuth response: ",
          parsedResponse
        );
        return;
      }

      await setValueForKey("accessToken", accessToken as string);
      await setValueForKey("refreshToken", refreshToken as string);

      await queryClient.invalidateQueries(["user"]);

      console.log("Succesfull Gitlab login");

      Toast.show({
        type: "success",
        text1: "Succesfully logged in with Gitlab",
      });
    } catch (err: any) {
      console.error("Error during Gitlab login: ", err.message);
    }
  };
};
