import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

import { http } from "../utils/http";
import { APIUser, APIError } from "../utils/types";
import { useLogout } from "./auth-hooks";
import { useSecureStore } from "./use-secure-store";

const fetchUser = () => http.get("user").then((res) => res.data);

const updateUser = (user: Partial<APIUser>) =>
  http.put("user", user).then((res) => res.data);

const deleteUser = () => http.delete("user").then((res) => res.data);

export const useUser = (options?: UseQueryOptions<APIUser, APIError>) => {
  const logout = useLogout();

  const userQuery = useQuery<APIUser, APIError>(["user"], fetchUser, {
    onSuccess: async (data) => {
      console.log("User data", data);
      // If no data is returned from the API, it means the user has been deleted
      if (!data) await logout();
    },
    onError: (err) => {
      console.error("Error during GET /user: ", err.response?.data?.message);
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
  const queryClient = useQueryClient();
  const { deleteValueForKey } = useSecureStore();

  return useMutation(deleteUser, {
    onSuccess: async () => {
      await deleteValueForKey("accessToken");
      await deleteValueForKey("refreshToken");

      await queryClient.resetQueries(["user"]);
      console.log("User deleted");
    },
    onError: (err: APIError) => {
      console.error("Error during DELETE /user: ", err.response?.data?.message);
    },
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<APIUser, APIError, Partial<APIUser>>
) => {
  const queryClient = useQueryClient();

  return useMutation(updateUser, {
    onMutate: async (data) => {
      console.log("Optimistically updating user with: ", data);
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["user"]);
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["user"]) as APIUser;
      // Optimistically update the user
      queryClient.setQueryData(["user"], { ...previousData, ...data });
      // Return a context object with the snapshotted value
      return { previousData };
    },
    onSuccess: async () => {
      console.log("User updated successfully");
    },
    onError: (err: APIError, _data, previousData) => {
      console.error("Error during PUT /user: ", err.response?.data?.message);
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["user"], previousData);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["user"]);
    },
    ...options,
  });
};
