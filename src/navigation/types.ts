export type RootStackParamList = {
  Inbox: undefined;
  Settings: undefined;
  NotificationDetail: Notification;
  Login: undefined;
  Signup: undefined;
};

type Notification = {
  title: string;
  body: string;
};
