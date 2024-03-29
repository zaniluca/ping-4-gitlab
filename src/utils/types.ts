import { AxiosError } from "axios";

export type NotificationType = "issue" | "merge" | "general";

export type Headers = ProjectHeaders &
  IssueHeaders &
  MergeHeaders &
  EpicHeaders &
  CommitHeaders &
  PipelineHeaders;

type ProjectHeaders = {
  "x-gitlab-project": string;
  "x-gitlab-project-id": string;
  "x-gitlab-project-path": string;
};

type EpicHeaders = {
  "x-gitlab-epic-id": string;
  "x-gitlab-epic-iid": string;
  "x-gitlab-group-path": string;
};

type IssueHeaders = {
  "x-gitlab-issue-id": string;
  "x-gitlab-issue-iid": string;
};

type MergeHeaders = {
  "x-gitlab-mergerequest-id": string;
  "x-gitlab-mergerequest-iid": string;
};

type PipelineHeaders = {
  "x-gitlab-pipeline-id": string;
  "x-gitlab-pipeline-status": PipelineStatus;
};

type CommitHeaders = {
  "x-gitlab-commit-id": string;
};

export type PipelineStatus = "success" | "failed";

export type APIUser = {
  onboardingCompleted: boolean;
  hookId: string;
  id: string;
  email: string | null;
  expoPushTokens: string[];
  mutedUntil: string | null;
  gitlabId: number | null;
};

export type APIError = AxiosError<{
  message: string;
}>;

export type APIAuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type APINotification = {
  id: string;
  subject: string;
  html: string;
  text: string | null;
  headers: Partial<Headers>;
  recived: string;
  viewed: boolean;
  contentHash: string;
  userId: string;
};
