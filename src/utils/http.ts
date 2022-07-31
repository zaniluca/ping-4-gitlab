import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { getAccessTokenFromSecureStore } from "./jwt";

const host =
  Platform.OS === "android"
    ? // 10.0.2.2 is the special host for accessing localhost via android emulator
      "10.0.2.2"
    : // Getting the IP address of the device we're developing on to make work with Expo GO
      Constants.manifest?.debuggerHost!.split(":").shift();

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
