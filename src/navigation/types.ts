export type RootStackParamList = {
  Inbox: undefined;
  Settings: undefined;
  NotificationDetail: Notification;
  Login: undefined;
};

type Notification = {
  title: string;
  body: string;
};
