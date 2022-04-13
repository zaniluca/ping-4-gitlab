import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Notification } from "../utils/types";

export type RootStackParamList = {
  Inbox: undefined;
  Settings: undefined;
  GetStarted: undefined;
  NotificationDetail: Notification;
  Login: undefined;
  Landing: undefined;
  Signup: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
