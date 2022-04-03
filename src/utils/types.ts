export type Notification = {
  headers: string;
  subject: string;
  text: string;
  html?: string;
  viewed: boolean;
  timestamp: string;
};

export type NotificationType = "issue" | "merge" | "general";

export type Headers = {
  "auto-submitted": string;
  "content-transfer-encoding": string;
  "content-type": string;
  date: string;
  from: string;
  "in-reply-to": string;
  "list-id": string;
  "list-unsubscribe": string;
  "message-id": string;
  "mime-version": string;
  received: string;
  references: string;
  "reply-to": string;
  sender: string;
  to: string;
  "x-auto-response-suppress": string;
  "x-gitlab-discussion-id": string;
  "x-gitlab-issue-id": string;
  "x-gitlab-issue-iid": string;
  "x-gitlab-notificationreason": string;
  "x-gitlab-project": string;
  "x-gitlab-project-id": string;
  "x-gitlab-project-path": string;
  "x-gitlab-reply-key": string;
  "x-mailgun-sending-ip": string;
  "x-mailgun-sid": string;
};
