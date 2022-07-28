import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { http } from "../utils/http";
import { APIUser, APIError } from "../utils/types";

const fetchUser = () =>
  http
    .get("user", {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJjbDY1aHhvZDIwMDEyMDR1dWI5ZnlpejJkIiwiaWF0IjoxNjU5MDQwNTk1LCJleHAiOjE2NTkwNDQxOTV9.yCG-nqamS0DeZwUW_Nb6fc5kLWX6wyKjK2KbuhVJCNc`,
      },
    })
    .then((res) => res.data);

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
