import axios from "axios";
import { Platform } from "react-native";

// 10.0.2.2 is the special host for accessing localhost via android emulator
const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";

const BACKEND_URL = __DEV__ ? `http://${host}:8080` : "https://api.example.com";

export const http = axios.create({
  baseURL: BACKEND_URL,
  // headers: {
  //   Authorization: "Bearer " + process.env.JWT_ACCESS_TOKEN,
  // },
});
