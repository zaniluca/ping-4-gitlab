import { User as FirebaseUser } from "firebase/auth";

export type NotificationType = "issue" | "merge" | "general";

type UserProps = {
  expo_push_token?: string;
};

export type User = (FirebaseUser & UserProps) | null;

export type Notification = {
  id: string;
  subject: string;
  text: string;
  raw_text: string;
  headers: Headers;
  raw_headers: string;
  recived: Date;
  viewed: boolean;
};

export type Headers = ProjectHeaders & IssueHeaders & MergeHeaders;

type ProjectHeaders = {
  "x-gitlab-project"?: string;
  "x-gitlab-project-id"?: string;
  "x-gitlab-project-path"?: string;
};

type IssueHeaders = {
  "x-gitlab-issue-id"?: string;
  "x-gitlab-issue-iid"?: string;
};

type MergeHeaders = {
  "x-gitlab-mergerequest-id"?: string;
  "x-gitlab-mergerequest-iid"?: string;
};
