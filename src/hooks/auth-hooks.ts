import { useQueryClient, useMutation } from "@tanstack/react-query";

import { http } from "../utils/http";
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

  return useMutation(signup, {
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

  return useMutation(login, {
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

  return useMutation(anonymousLogin, {
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