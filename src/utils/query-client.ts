import axios from "axios";
import { QueryClient } from "react-query";

const BACKEND_URL = __DEV__
  ? "http://localhost:8080"
  : "https://api.example.com";

export const client = axios.create({
  baseURL: BACKEND_URL,
});

const queryClient = new QueryClient();

export default queryClient;
