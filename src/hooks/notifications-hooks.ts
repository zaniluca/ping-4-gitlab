import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

import { http } from "../utils/http";
import { APIError, APINotification } from "../utils/types";
import { useUser } from "./user-hooks";

const fetchNotification = (id: string) =>
  http.get(`notification/${id}`).then((res) => res.data);

const fetchNotificationsList = async ({ pageParam = "" }) => {
  const { data } = await http.get(
    "notification/list" +
      (pageParam
        ? `?${new URLSearchParams({
            cursor: pageParam,
          })}`
        : "")
  );

  return {
    data,
    nextCursor: data.length ? data[data.length - 1].id : undefined,
  };
};

type NotificationUpdateRequest = {
  id: string;
  data: Partial<APINotification>;
};

type APIPaginatedNotifications = {
  data: APINotification[];
  nextCursor?: number;
};

const updateNotification = ({ id, data }: NotificationUpdateRequest) =>
  http
    .put(`notification/${id}`, data)
    .then((res) => res.data as APINotification);

export const useNotificationsList = () => {
  const user = useUser();

  return useInfiniteQuery<APIPaginatedNotifications, APIError>(
    ["notifications"],
    fetchNotificationsList,
    {
      enabled: !!user.hasCompletedOnboarding,
      getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
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
      ]) as InfiniteData<APIPaginatedNotifications>;

      // Finding the page that contains the notification
      const associatedNotificationPage = previousData.pages.find(({ data }) =>
        data.find((n) => n.id === id)
      );

      // Finding the notification in the page
      const previousNotificationData = associatedNotificationPage?.data.find(
        (n) => n.id === id
      );

      if (!previousNotificationData || !associatedNotificationPage) {
        console.log(
          "Notification not found in cache, skipping optimistic update"
        );
        return;
      }

      // We need the index of both the element to update and the page it's in to update the cache
      const previousNotificationIndex = associatedNotificationPage.data.indexOf(
        previousNotificationData
      );

      const associatedNotificationPageIndex = previousData.pages.indexOf(
        associatedNotificationPage
      );

      console.log(
        `Optimistically updating notification ${id} at index ${previousNotificationIndex} in page ${associatedNotificationPageIndex}`
      );

      const updatedNotificationPage: APIPaginatedNotifications = {
        nextCursor: associatedNotificationPage.nextCursor,
        data: associatedNotificationPage.data.splice(
          previousNotificationIndex,
          1,
          {
            ...previousNotificationData,
            ...data,
          }
        ),
      };

      queryClient.setQueryData<InfiniteData<APIPaginatedNotifications>>(
        ["notifications"],
        () => ({
          pages: previousData.pages.splice(
            associatedNotificationPageIndex,
            1,
            updatedNotificationPage
          ),
          pageParams: previousData.pageParams,
        })
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
