import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";

import { http } from "../utils/http";
import { APIUser, APIError } from "../utils/types";
import { useSecureStore } from "./use-secure-store";

const fetchUser = () => http.get("user").then((res) => res.data);

const updateUser = (user: Partial<APIUser>) =>
  http.put("user", user).then((res) => res.data);

const deleteUser = () => http.delete("user").then((res) => res.data);

export const useUser = (options?: UseQueryOptions<APIUser, APIError>) => {
  const userQuery = useQuery<APIUser, APIError>(["user"], fetchUser, {
    onSuccess: (data) => {
      console.log("User data", data);
    },
    onError: (err) => {
      console.log("Error during GET /user: ", err.response?.data.message);
    },
    ...options,
  });

  return {
    isAnonymous: !userQuery.data?.email,
    hasCompletedOnboarding: userQuery.data?.onboardingCompleted,
    ...userQuery,
  };
};

export const useDeleteUser = () => {
  const { deleteValueForKey } = useSecureStore();
  return useMutation(deleteUser, {
    onSuccess: async () => {
      await deleteValueForKey("accessToken");
      await deleteValueForKey("refreshToken");
      console.log("User deleted");
    },
    onError: (err: APIError) => {
      console.log("Error during DELETE /user: ", err.response?.data.message);
    },
  });
};

export const useUpdateUser = () =>
  useMutation(updateUser, {
    onMutate: (data) => {
      console.log("Updating user with: ", data);
    },
    onSuccess: () => {
      console.log("User updated successfully");
    },
    onError: (err: APIError) => {
      console.log("Error during PUT /user: ", err.response?.data.message);
    },
  });
