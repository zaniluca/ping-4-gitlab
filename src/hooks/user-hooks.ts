import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { http } from "../utils/http";
import { APIUser, APIError } from "../utils/types";

const fetchUser = () => http.get("user").then((res) => res.data);

export const useUser = (options?: UseQueryOptions<APIUser, APIError>) =>
  useQuery<APIUser, APIError>(["user"], fetchUser, {
    onSuccess: (data) => {
      console.log("User data", data);
    },
    onError: (err) => {
      console.log("Error during GET /user: ", err.response?.data.message);
    },
    ...options,
  });
