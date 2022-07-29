import axios from "axios";
import { Platform } from "react-native";

import { getAccessTokenFromSecureStore } from "./jwt";

// 10.0.2.2 is the special host for accessing localhost via android emulator
const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";

const BACKEND_URL = __DEV__ ? `http://${host}:8080` : "https://api.example.com";

export const http = axios.create({
  baseURL: BACKEND_URL,
});

http.interceptors.request.use(async (config) => {
  const accessToken = await getAccessTokenFromSecureStore();
  if (accessToken) {
    config.headers!.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
