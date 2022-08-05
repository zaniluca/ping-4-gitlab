import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { getAccessTokenFromSecureStore } from "./jwt";

const getDevelopmentApiUrl = () => {
  const host =
    Platform.OS === "android"
      ? // 10.0.2.2 is the special host for accessing localhost via android emulator
        "10.0.2.2"
      : // Getting the IP address of the device we're developing on to make work with Expo GO
        Constants.manifest?.debuggerHost?.split(":").shift();

  return `http://${host}:8080`;
};

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.API_URL
    : getDevelopmentApiUrl();

export const http = axios.create({
  baseURL: API_URL,
});

http.interceptors.request.use(async (config) => {
  const accessToken = await getAccessTokenFromSecureStore();
  if (accessToken) {
    config.headers!.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
