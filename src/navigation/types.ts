import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { APINotification } from "../utils/types";

export type RootStackParamList = {
  Inbox: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  GetStarted: undefined;
  NotificationDetail: APINotification;
  Login: undefined;
  Landing: undefined;
  Signup: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
