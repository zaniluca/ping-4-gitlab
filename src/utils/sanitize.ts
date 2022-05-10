import { Notification, PipelineStatus } from "./types";

export const sanitizeSubject = (n: Notification) => {
  const isPipe = !!n.headers["x-gitlab-pipeline-id"];

  const PIPELINE_SUBJECT: Record<PipelineStatus, string> = {
    success: "Pipeline Succeded!",
    failed: "Pipeline Failed!",
  };

  if (isPipe) {
    const status = n.headers["x-gitlab-pipeline-status"];
    return status ? PIPELINE_SUBJECT[status] : "Pipeline";
  }

  return n.subject
    .replace(`Re: ${n.headers["x-gitlab-project"]} | `, "")
    .trimStart();
};
