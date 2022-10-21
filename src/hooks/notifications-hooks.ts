import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

import { http } from "../utils/http";
import { APIError, APINotification } from "../utils/types";
import { useUser } from "./user-hooks";

const fetchNotificationsList = () =>
  http.get("notification/list").then((res) => res.data);

const fetchNotification = (id: string) =>
  http.get(`notification/${id}`).then((res) => res.data);

type NotificationUpdateRequest = {
  id: string;
  data: Partial<APINotification>;
};

const updateNotification = ({ id, data }: NotificationUpdateRequest) =>
  http
    .put(`notification/${id}`, data)
    .then((res) => res.data as APINotification);

export const useNotificationsList = () => {
  const user = useUser();

  return useQuery<APINotification[], APIError>(
    ["notifications"],
    fetchNotificationsList,
    {
      enabled: !!user.hasCompletedOnboarding,
      refetchInterval: 1000 * 60,
      onError: (err: APIError) => {
        console.log(
          "Error fetching notifications",
          err.response?.data?.message
        );
      },
    }
  );
};

export const useNotification = (
  id: string,
  options?: UseQueryOptions<APINotification, APIError>
) => {
  const user = useUser();

  return useQuery<APINotification, APIError>(
    ["notifications", id],
    () => fetchNotification(id),
    {
      enabled: !!user.data,
      onError: (err) => {
        console.log(
          `Error fetching notification ${id}`,
          err.response?.data?.message
        );
      },
      ...options,
    }
  );
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation(updateNotification, {
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(["notifications"]);

      const previousData = queryClient.getQueryData([
        "notifications",
      ]) as APINotification[];

      const previousNotificationData = previousData.find((n) => n.id === id);

      if (!previousNotificationData) {
        console.log(
          "Notification not found in cache, skipping optimistic update"
        );
        return;
      }

      console.log(`Optimistically updating notification ${id}:`, data);

      const updatedNotification = {
        ...previousNotificationData,
        ...data,
      };

      // Optimistically update the notifications
      queryClient.setQueryData(
        ["notifications"],
        [...previousData.filter((n) => n.id !== id), updatedNotification]
      );
      // Return a context object with the snapshotted value
      return previousData;
    },
    onSuccess: async () => {
      console.log("Successfully updated notification");
    },
    onError: (err: APIError, _data, previousData) => {
      console.log("Error updating notification", err.response?.data?.message);
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["notifications"], previousData);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};
