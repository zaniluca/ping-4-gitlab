import { useQueryClient, useMutation } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

import { useRootStackNavigation } from "./navigation-hooks";
import { useAnalytics } from "./use-analytics";
import { useSecureStore } from "./use-secure-store";
import { useUser } from "./user-hooks";
import { API_URL, http } from "../utils/http";
import { APIAuthResponse, APIError } from "../utils/types";

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
      await queryClient.refetchQueries({ queryKey: ["user"] });
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
      await queryClient.refetchQueries({ queryKey: ["user"] });
    },
    onError: (err: APIError) => {
      console.error("Error during POST /login: ", err.response?.data?.message);
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
      await queryClient.refetchQueries({ queryKey: ["user"] });
    },
    onError: (err: APIError) => {
      console.error(
        "Error signing in POST /anonymous",
        err.response?.data?.message
      );
    },
  });
};

export const useLogout = () => {
  const { deleteValueForKey } = useSecureStore();
  const queryClient = useQueryClient();
  const analytics = useAnalytics();

  return async () => {
    try {
      await deleteValueForKey("accessToken");
      await deleteValueForKey("refreshToken");

      await queryClient.resetQueries({ queryKey: ["user"] });
      await queryClient.resetQueries({ queryKey: ["notifications"] });

      analytics.reset();

      console.log("User logged out");
    } catch (err: any) {
      console.error("Error during logout: ", err.message);
    }
  };
};

export const useGitlabLogin = () => {
  const user = useUser();

  // https://docs.expo.dev/guides/authentication/#warming-the-browser
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  return async () =>
    await WebBrowser.openBrowserAsync(
      `${API_URL}/oauth/gitlab/authorize?state=${user.data?.id ?? ""}`
    );
};
