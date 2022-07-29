import * as SecureStore from "expo-secure-store";
import decodeJwt, { JwtPayload } from "jwt-decode";
import { http } from "./http";
import { APIAuthResponse } from "./types";

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
