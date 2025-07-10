import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type InboxStackParamList = {
  Inbox: undefined;
  NotificationDetail: { id: string };
  Settings: undefined;
  AccountSettings: undefined;
  GetStarted: undefined;
};

export type InboxStackScreenProps<T extends keyof InboxStackParamList> =
  NativeStackScreenProps<InboxStackParamList, T>;

export type RootStackParamList = {
  InboxStack: NavigatorScreenParams<InboxStackParamList>;
  Login:
    | {
        accessToken?: string;
        refreshToken?: string;
        error?: string;
      }
    | undefined;
  Landing: undefined;
  Signup: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
