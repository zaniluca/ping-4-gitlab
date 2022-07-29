import { AxiosError } from "axios";
import { User as FirebaseUser } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export type NotificationType = "issue" | "merge" | "general";

export type UserData = {
  expo_push_tokens?: string[];
  onboarding?: boolean;
  hook_id?: string;
  hasDisabledNotifications?: boolean;
};

export type User = FirebaseUser | null;

export type Notification = {
  id: string;
  subject: string;
  text: string;
  raw_text: string;
  headers: Headers;
  raw_headers: string;
  recived: Timestamp;
  viewed: boolean;
  html: string;
};

export type Headers = ProjectHeaders &
  IssueHeaders &
  MergeHeaders &
  PipelineHeaders;

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

type PipelineHeaders = {
  "x-gitlab-pipeline-id"?: string;
  "x-gitlab-pipeline-status"?: PipelineStatus;
};

export type PipelineStatus = "success" | "failed";

export type APIUser = {
  onboardingCompleted: boolean;
  hookId: string;
};

export type APIError = AxiosError<{
  message: string;
}>;

export type APIAuthResponse = {
  accessToken: string;
  refreshToken: string;
};
