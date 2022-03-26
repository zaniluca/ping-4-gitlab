export type RootStackParamList = {
  Inbox: undefined;
  Settings: undefined;
  NotificationDetail: Notification;
};

type Notification = {
  title: string;
  body: string;
};
