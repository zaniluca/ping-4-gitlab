import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Inbox: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  GetStarted: undefined;
  NotificationDetail: {
    id: string;
  };
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
