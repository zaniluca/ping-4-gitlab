import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../utils/http";
import { APIError, APINotification, WithId } from "../utils/types";
import { useUser } from "./user-hooks";

const fetchNotifications = () =>
  http.get("notification/list").then((res) => res.data as APINotification[]);

type NotificationUpdateRequest = {
  id: string;
  data: Partial<APINotification>;
};

const updateNotification = ({ id, data }: NotificationUpdateRequest) =>
  http.put(`notification/${id}`, data).then((res) => res.data as WithId);

export const useNotificationsList = () => {
  const user = useUser();
  // const queryClient = useQueryClient();

  return useQuery<APINotification[], APIError>(
    ["notifications"],
    fetchNotifications,
    {
      enabled: !!user.data,
      refetchInterval: 1000 * 20,
      onSuccess: () => {
        // This should be done to load the notifications into the cache individually
        // So that we can invalidate the single notification when it is updated
        // data.forEach((notification) =>
        //   queryClient.setQueryData(
        //     ["notifications", notification.id],
        //     notification
        //   )
        // );
      },
      onError: (err: APIError) => {
        console.log("Error fetching notifications", err.response?.data.message);
      },
    }
  );
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation(updateNotification, {
    onMutate: (req) => {
      console.log(`Updating notification ${req.id}:`, req.data);
    },
    onSuccess: async (data) => {
      console.log("Successfully updated notification");

      await queryClient.invalidateQueries(["notifications"]);
      // Invalidate specific notification
      // await queryClient.invalidateQueries(["notifications", data.id]);
    },
    onError: (err: APIError) => {
      console.log("Error updating notification", err.response?.data.message);
    },
  });
};
