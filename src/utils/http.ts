import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import decodeJwt, { JwtPayload } from "jwt-decode";
import { Platform } from "react-native";

import { APIAuthResponse } from "./types";

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

export const getAccessTokenFromSecureStore = async () => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  if (accessToken) {
    const payload = decodeJwt<JwtPayload>(accessToken);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.log("Access token expired, refreshing");
      await SecureStore.deleteItemAsync("accessToken");
      await refreshAccessToken();
    }
  }

  return await SecureStore.getItemAsync("accessToken");
};

const refreshAccessToken = async () => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (refreshToken) {
    try {
      const {
        data: { accessToken, refreshToken: newRefreshToken },
      } = await http.post<APIAuthResponse>("/refresh", { refreshToken });

      console.log("Refreshed access token");

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
    } catch (error) {
      console.log("Could not refresh access token", error);
      await SecureStore.deleteItemAsync("refreshToken");
    }
  }
};
