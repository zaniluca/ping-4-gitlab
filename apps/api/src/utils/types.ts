import type { Request } from "express";
import type { Request as ExpressJwtRequest } from "express-jwt";
import type { JwtPayload } from "jsonwebtoken";

export type CustomJWTClaims = JwtPayload & {
  uid: string;
};

export interface RequestWithPayload<T> extends Request {
  body: Partial<T>;
}

export interface AuthRequestWithPayload<T>
  extends ExpressJwtRequest<CustomJWTClaims> {
  body: Partial<T>;
}

export type WebhookPayload = {
  headers: string;
  from: string;
  to: string;
  text: string;
  html: string;
  subject: string;
  dkim: string;
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
