import type { JwtPayload } from "jsonwebtoken";
import type { JwtVariables } from "hono/jwt";
import { getDrizzleClient } from "../db/client";
import { Logger } from "./logger";

export type CustomJWTClaims = JwtPayload & {
  uid: string;
  hookId?: string | null;
};

export type WebhookPayload = {
  headers: string;
  // from: string;
  to: string;
  text?: string;
  html?: string;
  subject: string;
  // dkim: string;
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

export type Bindings = Env;

// Variables stored in context
export type Variables = JwtVariables & {
  userId: string;
  hookId: string;
  logger: Logger;
  db: ReturnType<typeof getDrizzleClient>;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
